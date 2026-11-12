#!/usr/bin/env python3
"""Offline publisher integration tests. Never calls Cloudflare or live feeds."""
import importlib.util
import json
from copy import deepcopy
from pathlib import Path
import shutil
from tempfile import TemporaryDirectory
from datetime import datetime, timezone
from unittest.mock import patch

module_path = Path(__file__).resolve().parent / "publish_daily.py"
spec = importlib.util.spec_from_file_location("autopub", module_path)
pub = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pub)

NOW = datetime(2026, 11, 13, 0, 0, tzinfo=timezone.utc)
FEED = b"""<rss><channel>
<item>
<title>OpenAI announces an AI agent model update</title>
<link>https://openai.com/news/agent-update</link>
<pubDate>Thu, 12 Nov 2026 09:00:00 +0000</pubDate>
<description>OpenAI has announced a new model update for AI agent developers, including new documentation for using it safely in coding workflows.</description>
</item>
</channel></rss>"""
PAGE = b"""<html><main><h1>OpenAI announces an AI agent model update</h1>
<p>OpenAI has announced a new model update for AI agent developers, including new documentation for using it safely in coding workflows.</p>
<p>Developers can read the official documents to confirm the functionality, security limitations, and supported usage scenarios.</p>
<p>The availability, price, and performance of this model depend on the official product documentation and have not been independently tested.</p>
</main></html>"""
DRAFT = {
    "title": "AIエージェントの新しいモデルは開発の現場をどう変えるのか",
    "summary": "OpenAIの公式発表によると、AIエージェントを開発する人向けに新しいモデルの更新情報が公開されました。対応機能や条件は公式の資料を確認する必要があり、性能について独立した検証はまだ行われていません。",
    "technical": [
        "公式資料にはAIエージェントの開発者を対象とした新しいモデルの更新情報が含まれています。実際に利用する前には、対応範囲と利用上の制約を公式ドキュメントで確認する必要があります。",
        "モデルの動作条件や性能について、公開された概要のみをもとに具体的な業務成果を断定することはできません。本紙は発表内容を紹介するものであり、独自の性能測定を行ったものではありません。",
    ],
    "whyItMatters": "AIエージェントを活用する開発者にとって、新しい選択肢の詳細を確認するきっかけとなります。",
    "evidenceIds": ["E1", "E2"],
    "visualPrompt": "A cinematic editorial conceptual image of abstract software agents represented as connected translucent nodes, no logos or text.",
}

def fake_fetch(url, hosts, *args, **kwargs):
    return FEED if url.endswith("rss.xml") else PAGE

def fake_image(*args):
    return b"\xff\xd8\xff" + b"\x00" * 18000

def test_editorial_repair():
    candidate = {"source": "OpenAI", "url": "https://openai.com/news/agent-update",
                 "title": "An AI agent model update", "date": "2026-11-12"}
    evidence = {
        "E1": "OpenAI released an AI model update for agent developers.",
        "E2": "Developers should consult official documentation before relying on performance.",
    }
    broken = deepcopy(DRAFT)
    broken["technical"] = ["短い文"]
    good = deepcopy(DRAFT)
    with patch.object(pub, "text_ai", side_effect=[broken, good, {"accept": True, "issues": []}]) as model:
        assert pub.editorial_draft("a", "secret", candidate, evidence) == good
        assert model.call_count == 3, "Exactly one bounded repair and one review"

    with patch.object(pub, "text_ai", side_effect=[broken, broken]) as model:
        try:
            pub.editorial_draft("a", "secret", candidate, evidence)
        except ValueError as e:
            assert str(e) == "Two technical sections are required"
        else:
            raise AssertionError("Invalid repaired article must not pass")
        assert model.call_count == 2, "Never make unlimited repair calls"

    with patch.object(pub, "text_ai", side_effect=[broken, good, {"accept": False, "issues": ["Unsubstantiated"]}]) as model:
        try:
            pub.editorial_draft("a", "secret", candidate, evidence)
        except ValueError as e:
            assert str(e) == "Fact-check review rejected the draft"
        else:
            raise AssertionError("Repaired text still requires skeptical review")
        assert model.call_count == 3
    print("REPAIR_TEST_OK: bounded repair, strict revalidation, independent review")


def main():
    test_editorial_repair()
    original = Path(__file__).resolve().parents[1] / "src" / "data"
    with TemporaryDirectory() as td:
        temp = Path(td)
        data = temp / "src" / "data"
        archives = data / "issues"
        images = temp / "public" / "images" / "auto"
        archives.mkdir(parents=True)
        images.mkdir(parents=True)
        shutil.copy(original / "articles.json", data / "articles.json")
        shutil.copy(original / "issues" / "2026-11-10.json", archives / "2026-11-10.json")
        shutil.copy(original / "visuals.generated.json", data / "visuals.generated.json")
        source = pub.SOURCES[0]
        with patch.object(pub, "DATA", data), patch.object(pub, "ISSUES", archives), \
             patch.object(pub, "IMAGES", images), patch.object(pub, "SOURCES", (source,)), \
             patch.object(pub, "fetch", fake_fetch), \
             patch.object(pub, "editorial_draft", return_value=DRAFT), \
             patch.object(pub, "render_image", side_effect=fake_image):
            with patch.dict("os.environ", {"CF_ACCOUNT_ID": "0" * 32,
                                           "CF_WORKERS_AI_TOKEN": "fake-for-offline-test-only",
                                           "CF_WORKERS_FREE_CONFIRMED": "false"}):
                assert pub.generate_today(NOW) is False, "Free-plan flag must prevent publication"
                assert not (archives / "2026-11-13.json").exists()
            with patch.dict("os.environ", {"CF_ACCOUNT_ID": "0" * 32,
                                           "CF_WORKERS_AI_TOKEN": "fake-for-offline-test-only",
                                           "CF_WORKERS_FREE_CONFIRMED": "true"}):
                assert pub.generate_today(NOW) is True
                result = json.loads((data / "articles.json").read_text("utf-8"))
                assert result["issueDate"] == "2026-11-13"
                assert result["issueNumber"] == 2
                assert len(result["articles"]) == 1
                assert (archives / "2026-11-13.json").exists()
                assert (images / (result["articles"][0]["slug"] + ".jpg")).exists()
                assert pub.generate_today(NOW) is False, "Same-day repeat must not overwrite issue"
                assert (archives / "2026-11-10.json").exists(), "Original issue must be preserved"
                assert result["articles"][0]["sources"][0]["url"].startswith("https://openai.com/")
        print("INTEGRATION_TEST_OK: Free gate, generate, archive, visual, repeat protection")

if __name__ == "__main__":
    main()
