const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealTargets = document.querySelectorAll(".reveal");
const aiMark = document.querySelector("[data-ai-mark]");
const helpAnswer = document.querySelector("[data-help-answer]");

const helpTopics = {
  about: {
    title: "FeatherTuneとは？",
    body:
      "FeatherTuneは、楽曲の魅力・構造・表現・既視感を音楽的に整理する分析レポートです。ふわっとした感覚を、共有しやすい言葉と資料に変える案内役です。",
    links: [
      ["1ページ図解を見る", "about-infographic.html"],
      ["詳しい概要を見る", "about.html"],
    ],
  },
  origin: {
    title: "ORIGIN登録したい",
    body:
      "まずはORIGIN登録フォームから始めます。登録特典として初回1回・1曲までORIGIN分析を受けられます。メールアドレスが正本で、Discord参加は任意です。",
    links: [
      ["ORIGIN登録フォームを開く", "https://docs.google.com/forms/d/e/1FAIpQLScmKYl528g_DqiLRK5ZPPgFjS2ex607TepTx1w34TiYIlHdcQ/viewform"],
      ["ORIGINの流れを見る", "origin.html"],
    ],
  },
  flow: {
    title: "受付から納品まで",
    body:
      "大きな流れは、受付、素材準備、分析、レポート生成、確認、納品です。手順の迷子札は流れ図解にまとめています。",
    links: [
      ["流れ図解を見る", "flow-infographic.html"],
      ["やさしいルールを見る", "guide.html"],
    ],
  },
  report: {
    title: "レポートの見方",
    body:
      "スコアやランクは曲を雑に裁く札ではなく、制作判断や相談前の整理に使う目印です。サンプルで全体の読み心地を確認できます。",
    links: [
      ["サンプルレポートを見る", "samples.html"],
      ["FeatherTuneとはを見る", "about-infographic.html"],
    ],
  },
  discord: {
    title: "Discordは必要？",
    body:
      "Discord参加は任意です。コミュニティ参加、質問、共有には便利ですが、連絡の正本はメールアドレスです。気軽な待合室くらいに考えてください。",
    links: [
      ["Discordに参加する", "https://discord.gg/W6tg5UJN"],
      ["やさしいルールを見る", "guide.html"],
    ],
  },
  rights: {
    title: "著作権が心配",
    body:
      "FeatherTuneは法的判断や侵害認定を行いません。音楽的観点から確認ポイントを整理する参考資料です。権利判断が必要な場合は専門家への相談をおすすめします。",
    links: [
      ["免責事項を見る", "disclaimer.html"],
      ["プライバシーポリシーを見る", "privacy.html"],
    ],
  },
  monitor: {
    title: "MONITOR枠",
    body:
      "AI音楽メディア、ランキング、ポッドキャスト、ラジオ等の主催者向け枠です。採用した場合のみ運営より連絡し、合否理由には回答できません。",
    links: [["MONITOR枠を見る", "monitor.html"]],
  },
  contact: {
    title: "問い合わせたい",
    body:
      "LPを見ても迷う場合はメールでお問い合わせください。ORIGIN番号をお持ちの場合は、本文に書いていただくと確認が早くなります。",
    links: [["メールで問い合わせる", "mailto:contact@feathertune.com"]],
  },
};

const renderHelpAnswer = (topicKey) => {
  const topic = helpTopics[topicKey];

  if (!helpAnswer || !topic) {
    return;
  }

  const links = topic.links
    .map(([label, href]) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`)
    .join(" / ");

  helpAnswer.innerHTML = `
    <h3>${topic.title}</h3>
    <p>${topic.body}</p>
    <p>${links}</p>
  `;
};

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

const closeMenu = () => {
  menuToggle?.classList.remove("is-open");
  nav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
};

const markAiImageLoaded = () => {
  aiMark?.closest(".ai-mark-shell")?.classList.add("is-loaded");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("is-open");
  nav?.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.querySelectorAll("[data-help-topic]").forEach((button) => {
  button.addEventListener("click", () => renderHelpAnswer(button.dataset.helpTopic));
});

if (!document.body.classList.contains("no-floating-help") && !window.location.pathname.endsWith("/help.html")) {
  const floatingHelp = document.createElement("a");
  floatingHelp.className = "floating-help";
  floatingHelp.href = "help.html";
  floatingHelp.setAttribute("aria-label", "FeatherTuneヘルプを開く");
  floatingHelp.innerHTML = "<span>?</span><span>困った時のヘルプ</span>";
  document.body.appendChild(floatingHelp);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (aiMark) {
  if (aiMark.complete && aiMark.naturalWidth > 0) {
    markAiImageLoaded();
  }

  aiMark.addEventListener("load", markAiImageLoaded);

  aiMark.addEventListener("error", () => {
    const fallbackSrc = aiMark.dataset.fallbackSrc;
    const markShell = aiMark.closest(".ai-mark-shell");

    markShell?.classList.remove("is-loaded");

    if (fallbackSrc && !aiMark.src.endsWith(fallbackSrc)) {
      aiMark.src = fallbackSrc;
      return;
    }

    markShell?.classList.add("is-missing");
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}
