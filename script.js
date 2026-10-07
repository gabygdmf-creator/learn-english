document.addEventListener("DOMContentLoaded", function () {
  /* =========================================================
     AUDIO
  ========================================================= */

  let voices = [];

  function loadVoices() {
    voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  }

  if ("speechSynthesis" in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function speak(text, rate = 0.82) {
    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;

    const voice =
      voices.find((v) => /^en-US/i.test(v.lang)) ||
      voices.find((v) => /^en/i.test(v.lang));

    if (voice) utterance.voice = voice;

    speechSynthesis.speak(utterance);
  }

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const sections = document.querySelectorAll(".section");
  const navButtons = document.querySelectorAll(".nav-btn");

  function showSection(id) {
    sections.forEach((section) => {
      section.classList.toggle("active", section.id === id);
    });

    navButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.section === id);
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    updateProgress();
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showSection(button.dataset.section);
    });
  });

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      showSection(button.dataset.go);
    });
  });

  /* =========================================================
     VOCABULARY
  ========================================================= */

  const vocabulary = {
    parts: [
      { en: "Chicken Breast", es: "Pechuga de pollo", icon: "" },
      { en: "Chicken Thigh", es: "Muslo de pollo", icon: "" },
      { en: "Chicken Drumstick", es: "Pierna de pollo", icon: "" },
      { en: "Chicken Wing", es: "Ala de pollo", icon: "" },
      { en: "Skin", es: "Piel", icon: "" },
      { en: "Bone", es: "Hueso", icon: "" },
    ],

    ingredients: [
      { en: "Onion", es: "Cebolla", icon: "🧅" },
      { en: "Garlic", es: "Ajo", icon: "🧄" },
      { en: "Cilantro", es: "Cilantro", icon: "🌿" },
      { en: "Parsley", es: "Perejil", icon: "🌿" },
      { en: "Thyme", es: "Tomillo", icon: "🌿" },
      { en: "Celery", es: "Apio", icon: "🥬" },
      { en: "Seasoning", es: "Condimento", icon: "🧂" },
      { en: "Tomato", es: "Tomate", icon: "🍅" },
    ],

    preparation: [
      { en: "Cut", es: "Cortar", icon: "🔪" },
      { en: "Dice", es: "Cortar en cubitos", icon: "🔪" },
      { en: "Chop", es: "Picar", icon: "🥕" },
      { en: "Peel", es: "Pelar", icon: "🧄" },
      { en: "Add", es: "Agregar", icon: "➕" },
      { en: "Mix", es: "Mezclar", icon: "🥣" },
      { en: "Marinate", es: "Marinar", icon: "🍗" },
    ],

    work: [
      { en: "Weigh", es: "Pesar", icon: "⚖️" },
      { en: "Pack", es: "Empacar", icon: "📦" },
      { en: "Label", es: "Etiquetar", icon: "🏷️" },
      {
        en: "Put it in the fridge",
        es: "Ponerlo en el refrigerador",
        icon: "❄️",
      },
      {
        en: "Clean the work area",
        es: "Limpiar el área de trabajo",
        icon: "🧽",
      },
      { en: "Put everything away", es: "Guardar todo", icon: "🗃️" },
    ],

    tools: [
      { en: "Knife", es: "Cuchillo", icon: "🔪" },
      { en: "Cutting board", es: "Tabla para cortar", icon: "🪵" },
      { en: "Scale", es: "Balanza", icon: "⚖️" },
      { en: "Tray", es: "Bandeja", icon: "🍽️" },
      { en: "Gloves", es: "Guantes", icon: "🧤" },
      { en: "Container", es: "Recipiente", icon: "🥣" },
      { en: "Fridge", es: "Refrigerador", icon: "❄️" },
      { en: "Oven", es: "Horno", icon: "🔥" },
    ],
  };

  const vocabularyGrid = document.getElementById("vocabularyGrid");
  const catTabs = document.querySelectorAll(".cat-tab");

  function renderVocabulary(category = "parts") {
    vocabularyGrid.innerHTML = "";

    vocabulary[category].forEach((word) => {
      const card = document.createElement("div");

      card.className =
        category === "parts" ? "vocab-card parts-card" : "vocab-card";

      card.innerHTML = `
        <div class="vocab-icon">${word.icon}</div>
        <h3>${word.en}</h3>
        <p>${word.es}</p>
        <button class="audio-small">🎧 Listen</button>
      `;

      card.querySelector("button").addEventListener("click", (e) => {
        e.stopPropagation();
        speak(word.en);
      });

      vocabularyGrid.appendChild(card);
    });
  }

  catTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      catTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      renderVocabulary(tab.dataset.category);
    });
  });

  renderVocabulary();

  /* =========================================================
     INTERACTIVE READING
  ========================================================= */

  const readingText = document.getElementById("interactiveReading");

  const readingDictionary = {
    Maria: "María",
    works: "trabaja",
    at: "en",
    a: "un / una",
    busy: "ocupado / concurrido",
    meat: "carne",
    market: "mercado",
    She: "Ella",
    she: "ella",
    with: "con",
    and: "y",
    chicken: "pollo",
    prepares: "prepara",
    different: "diferentes",
    products: "productos",
    breast: "pechuga",
    thigh: "muslo",
    drumsticks: "piernas",
    wings: "alas",
    Some: "Algunos / algunas",
    some: "algunos / algunas",
    has: "tiene",
    skin: "piel",
    bones: "huesos",
    boneless: "sin hueso",
    skinless: "sin piel",
    First: "Primero",
    first: "primero",
    cuts: "corta",
    cut: "cortar",
    into: "en",
    small: "pequeños",
    pieces: "trozos",
    Sometimes: "A veces",
    sometimes: "a veces",
    dices: "corta en cubitos",
    Then: "Luego",
    then: "luego",
    prepares: "prepara",
    the: "el / la / los / las",
    ingredients: "ingredientes",
    uses: "usa",
    onion: "cebolla",
    garlic: "ajo",
    cilantro: "cilantro",
    parsley: "perejil",
    thyme: "tomillo",
    celery: "apio",
    chops: "pica",
    chop: "picar",
    peels: "pela",
    peel: "pelar",
    Next: "Después",
    next: "después",
    adds: "agrega",
    add: "agregar",
    seasoning: "condimento",
    mixes: "mezcla",
    mix: "mezclar",
    everything: "todo",
    marinates: "marina",
    marinate: "marinar",
    it: "lo / la",
    puts: "pone",
    put: "poner",
    in: "en",
    container: "recipiente",
    fridge: "refrigerador",
    After: "Después",
    after: "después",
    that: "eso",
    weighs: "pesa",
    weigh: "pesar",
    packs: "empaca",
    pack: "empacar",
    labels: "etiqueta",
    label: "etiquetar",
    package: "paquete",
    Her: "Su",
    her: "su",
    coworkers: "compañeros de trabajo",
    give: "dan",
    simple: "sencillas",
    instructions: "instrucciones",
    many: "muchas",
    tasks: "tareas",
    work: "trabajo",
    keeps: "mantiene",
    area: "área",
    clean: "limpia / limpio",
    products: "productos",
  };

  function makeInteractiveReading() {
    const original = readingText.innerText;

    const parts = original.split(/(\s+)/);

    readingText.innerHTML = "";

    parts.forEach((part) => {
      if (/^\s+$/.test(part)) {
        readingText.appendChild(document.createTextNode(part));
        return;
      }

      const clean = part.replace(/[.,!"“”]/g, "");

      if (!clean) {
        readingText.appendChild(document.createTextNode(part));
        return;
      }

      const span = document.createElement("span");
      span.className = "click-word";
      span.textContent = part;

      const meaning =
        readingDictionary[clean] || readingDictionary[clean.toLowerCase()];

      if (meaning) {
        span.addEventListener("click", () => {
          openWordPopup(clean, meaning);
        });
      }

      readingText.appendChild(span);
    });
  }

  function openWordPopup(english, spanish) {
    document.getElementById("popupEnglish").textContent = english;
    document.getElementById("popupSpanish").textContent = spanish;

    const popup = document.getElementById("wordPopup");
    const overlay = document.getElementById("overlay");

    popup.classList.remove("hidden");
    overlay.classList.remove("hidden");

    document.getElementById("popupAudio").onclick = () => {
      speak(english);
    };
  }

  function closePopup() {
    document.getElementById("wordPopup").classList.add("hidden");
    document.getElementById("overlay").classList.add("hidden");
  }

  document.getElementById("closePopup").addEventListener("click", closePopup);
  document.getElementById("overlay").addEventListener("click", closePopup);

  document.getElementById("readFullBtn").addEventListener("click", () => {
    const text = `
      Maria works at a busy meat market.
      She works with meat and chicken.
      Maria prepares different chicken products.
      She works with chicken breast, chicken thigh,
      chicken drumsticks, and chicken wings.
      Some chicken has skin and bones.
      Some chicken is boneless and skinless.
      First, Maria prepares the chicken.
      She cuts the chicken into small pieces.
      Sometimes she dices the chicken breast.
      Then, Maria prepares the ingredients.
      She uses onion, garlic, cilantro, parsley, thyme, and celery.
      She chops the onion.
      She chops the cilantro and parsley.
      She cuts the celery.
      She peels the garlic.
      Next, she adds the seasoning and mixes everything.
      Then, she adds the chicken and marinates it.
      Maria puts the chicken in a container.
      Then, she puts the container in the fridge.
      After that, she weighs the chicken.
      She packs the chicken and labels the package.
      Her coworkers give her simple instructions.
      Maria has many tasks at work.
    `;

    speak(text, 0.78);
  });

  makeInteractiveReading();

  /* =========================================================
     QUIZ
  ========================================================= */

  const quizData = [
    {
      q: "What does “cortar” mean?",
      audio: "What does cortar mean?",
      options: ["Cut", "Pack", "Weigh", "Peel"],
      answer: "Cut",
    },
    {
      q: "What is “pechuga de pollo”?",
      audio: "What is chicken breast?",
      options: [
        "Chicken wing",
        "Chicken breast",
        "Chicken thigh",
        "Chicken skin",
      ],
      answer: "Chicken breast",
    },
    {
      q: "What does “weigh” mean?",
      audio: "What does weigh mean?",
      options: ["Picar", "Pesar", "Pelar", "Mezclar"],
      answer: "Pesar",
    },
    {
      q: "Which ingredient do you PEEL?",
      audio: "Which ingredient do you peel?",
      options: ["Garlic", "Onion", "Thyme", "Celery"],
      answer: "Garlic",
    },
    {
      q: "How do you say “Agrega el condimento”?",
      audio: "How do you say agrega el condimento?",
      options: [
        "Mix the seasoning.",
        "Add the seasoning.",
        "Pack the seasoning.",
        "Weigh the seasoning.",
      ],
      answer: "Add the seasoning.",
    },
    {
      q: "What does “put” mean?",
      audio: "What does put mean?",
      options: ["Poner", "Cortar", "Pesar", "Limpiar"],
      answer: "Poner",
    },
    {
      q: "Choose the correct combination.",
      audio: "Choose the correct combination.",
      options: [
        "Chop the onion.",
        "Peel the onion with the fridge.",
        "Weigh the garlic with the knife.",
        "Pack the cilantro.",
      ],
      answer: "Chop the onion.",
    },
    {
      q: "Which one is the chicken piece with the long bone?",
      audio: "Which one is the chicken piece with the long bone?",
      options: [
        "Chicken breast",
        "Chicken wing",
        "Chicken drumstick",
        "Chicken skin",
      ],
      answer: "Chicken drumstick",
    },
    {
      q: "What does “marinate” mean?",
      audio: "What does marinate mean?",
      options: ["Marinar", "Picar", "Pesar", "Empacar"],
      answer: "Marinar",
    },
    {
      q: "What is a container?",
      audio: "What is a container?",
      options: ["Recipiente", "Cuchillo", "Etiqueta", "Balanza"],
      answer: "Recipiente",
    },
    {
      q: "What does “label the package” mean?",
      audio: "What does label the package mean?",
      options: [
        "Pesar el paquete",
        "Etiquetar el paquete",
        "Limpiar el paquete",
        "Cortar el paquete",
      ],
      answer: "Etiquetar el paquete",
    },
    {
      q: "What does “pack” mean?",
      audio: "What does pack mean?",
      options: ["Empacar", "Pelar", "Agregar", "Picar"],
      answer: "Empacar",
    },
  ];

  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;

  function renderQuiz() {
    const item = quizData[quizIndex];

    document.getElementById("quizProgress").textContent =
      `Question ${quizIndex + 1} of ${quizData.length}`;

    document.getElementById("quizBar").style.width =
      `${((quizIndex + 1) / quizData.length) * 100}%`;

    document.getElementById("quizQuestion").textContent = item.q;

    document.getElementById("quizFeedback").textContent = "";
    document.getElementById("quizFeedback").className = "feedback";

    document.getElementById("quizNext").classList.add("hidden");

    const options = document.getElementById("quizOptions");
    options.innerHTML = "";

    quizAnswered = false;

    item.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;

      btn.addEventListener("click", () => {
        if (quizAnswered) return;

        quizAnswered = true;

        if (option === item.answer) {
          btn.classList.add("correct");
          quizScore++;

          document.getElementById("quizFeedback").textContent =
            "✓ Correct! Great job!";

          document.getElementById("quizFeedback").className =
            "feedback correct-text";
        } else {
          btn.classList.add("wrong");

          document.getElementById("quizFeedback").textContent =
            `Not quite. The answer is: ${item.answer}`;

          document.getElementById("quizFeedback").className =
            "feedback wrong-text";

          [...options.children].forEach((b) => {
            if (b.textContent === item.answer) {
              b.classList.add("correct");
            }
          });
        }

        document.getElementById("quizNext").classList.remove("hidden");
        updateProgress();
      });

      options.appendChild(btn);
    });
  }

  document.getElementById("quizAudio").addEventListener("click", () => {
    speak(quizData[quizIndex].audio);
  });

  document.getElementById("quizNext").addEventListener("click", () => {
    quizIndex++;

    if (quizIndex >= quizData.length) {
      quizIndex = 0;
      document.getElementById("quizFeedback").textContent =
        `🎉 Quiz completed! Your score: ${quizScore}/${quizData.length}`;
    }

    renderQuiz();
  });

  renderQuiz();

  /* =========================================================
     MATCHING
  ========================================================= */

  const matchRounds = [
    [
      ["Chicken breast", "Pechuga de pollo"],
      ["Chicken thigh", "Muslo de pollo"],
      ["Chicken drumstick", "Pierna de pollo"],
      ["Chicken wing", "Ala de pollo"],
      ["Onion", "Cebolla"],
      ["Garlic", "Ajo"],
      ["Seasoning", "Condimento"],
      ["Container", "Recipiente"],
    ],
    [
      ["Cut", "Cortar"],
      ["Chop", "Picar"],
      ["Peel", "Pelar"],
      ["Add", "Agregar"],
      ["Mix", "Mezclar"],
      ["Marinate", "Marinar"],
      ["Weigh", "Pesar"],
      ["Pack", "Empacar"],
    ],
    [
      ["Knife", "Cuchillo"],
      ["Scale", "Balanza"],
      ["Tray", "Bandeja"],
      ["Gloves", "Guantes"],
      ["Label", "Etiqueta"],
      ["Fridge", "Refrigerador"],
      ["Package", "Paquete"],
      ["Cleaning cloth", "Paño"],
    ],
  ];

  let matchRound = 0;
  let matchSelected = null;
  let matchScore = 0;

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function renderMatching() {
    const pairs = matchRounds[matchRound];

    document.getElementById("matchRound").textContent = matchRound + 1;
    document.getElementById("matchScore").textContent = matchScore;

    const english = document.getElementById("englishMatches");
    const spanish = document.getElementById("spanishMatches");

    english.innerHTML = "";
    spanish.innerHTML = "";

    matchSelected = null;

    const shuffledEnglish = shuffle(
      pairs.map((pair, i) => ({
        text: pair[0],
        id: i,
      })),
    );

    const shuffledSpanish = shuffle(
      pairs.map((pair, i) => ({
        text: pair[1],
        id: i,
      })),
    );

    shuffledEnglish.forEach((item) => {
      const btn = document.createElement("button");
      btn.className = "match-item";
      btn.textContent = item.text;
      btn.dataset.id = item.id;
      btn.dataset.type = "english";

      btn.addEventListener("click", () => handleMatch(btn));

      english.appendChild(btn);
    });

    shuffledSpanish.forEach((item) => {
      const btn = document.createElement("button");
      btn.className = "match-item";
      btn.textContent = item.text;
      btn.dataset.id = item.id;
      btn.dataset.type = "spanish";

      btn.addEventListener("click", () => handleMatch(btn));

      spanish.appendChild(btn);
    });
  }

  function handleMatch(button) {
    if (button.classList.contains("matched")) return;

    if (!matchSelected) {
      matchSelected = button;
      button.classList.add("selected");

      speak(button.textContent);

      return;
    }

    if (matchSelected.dataset.type === button.dataset.type) {
      matchSelected.classList.remove("selected");
      button.classList.remove("selected");
      matchSelected = button;

      return;
    }

    if (matchSelected.dataset.id === button.dataset.id) {
      matchSelected.classList.remove("selected");
      matchSelected.classList.add("matched");

      button.classList.add("matched");

      matchScore++;

      document.getElementById("matchScore").textContent = matchScore;

      document.getElementById("matchFeedback").textContent = "✓ Perfect match!";

      document.getElementById("matchFeedback").className =
        "feedback correct-text";

      matchSelected = null;

      if (matchScore === (matchRound + 1) * 8) {
        if (matchRound < matchRounds.length - 1) {
          document.getElementById("nextMatchRound").classList.remove("hidden");
        } else {
          document.getElementById("matchFeedback").textContent =
            "🎉 Excellent! You completed all three rounds!";
        }
      }
    } else {
      document.getElementById("matchFeedback").textContent =
        "Try again. Look carefully!";

      document.getElementById("matchFeedback").className =
        "feedback wrong-text";

      matchSelected.classList.remove("selected");
      button.classList.add("selected");

      matchSelected = button;
    }
  }

  document.getElementById("nextMatchRound").addEventListener("click", () => {
    matchRound++;
    matchScore = matchRound * 8;

    document.getElementById("nextMatchRound").classList.add("hidden");

    renderMatching();
  });

  matchScore = 0;
  renderMatching();

  /* =========================================================
     GUESS THE WORD
  ========================================================= */

  const guessData = [
    {
      clue: "This is the white meat from a chicken.",
      answer: "Chicken breast",
      options: ["Chicken breast", "Chicken wing", "Chicken skin", "Celery"],
    },
    {
      clue: "You use this to weigh meat.",
      answer: "Scale",
      options: ["Knife", "Scale", "Tray", "Gloves"],
    },
    {
      clue: "You do this to garlic before using it.",
      answer: "Peel",
      options: ["Pack", "Peel", "Weigh", "Label"],
    },
    {
      clue: "You do this to onion when you cut it into small pieces.",
      answer: "Chop",
      options: ["Chop", "Marinate", "Pack", "Label"],
    },
    {
      clue: "You add this to give the chicken flavor.",
      answer: "Seasoning",
      options: ["Container", "Seasoning", "Package", "Fridge"],
    },
    {
      clue: "You put the chicken in this before putting it in the fridge.",
      answer: "Container",
      options: ["Container", "Scale", "Knife", "Label"],
    },
    {
      clue: "You do this before packing the chicken.",
      answer: "Weigh",
      options: ["Weigh", "Peel", "Chop", "Add"],
    },
    {
      clue: "You put the packed chicken in this.",
      answer: "Fridge",
      options: ["Fridge", "Knife", "Scale", "Tray"],
    },
    {
      clue: "This is the lower chicken piece with the long bone.",
      answer: "Chicken drumstick",
      options: [
        "Chicken breast",
        "Chicken thigh",
        "Chicken drumstick",
        "Chicken wing",
      ],
    },
    {
      clue: "You do this when you put seasoning on chicken and let it sit.",
      answer: "Marinate",
      options: ["Marinate", "Weigh", "Label", "Pack"],
    },
  ];

  let guessIndex = 0;
  let guessAnswered = false;

  function renderGuess() {
    const item = guessData[guessIndex];

    document.getElementById("guessNumber").textContent =
      `${guessIndex + 1} / ${guessData.length}`;

    document.getElementById("guessClue").textContent = item.clue;

    document.getElementById("guessFeedback").textContent = "";
    document.getElementById("guessNext").classList.add("hidden");

    const options = document.getElementById("guessOptions");
    options.innerHTML = "";

    guessAnswered = false;

    item.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;

      btn.addEventListener("click", () => {
        if (guessAnswered) return;

        guessAnswered = true;

        if (option === item.answer) {
          btn.classList.add("correct");

          document.getElementById("guessFeedback").textContent =
            "✓ You got it!";

          document.getElementById("guessFeedback").className =
            "feedback correct-text";
        } else {
          btn.classList.add("wrong");

          document.getElementById("guessFeedback").textContent =
            `The answer is: ${item.answer}`;

          document.getElementById("guessFeedback").className =
            "feedback wrong-text";

          [...options.children].forEach((b) => {
            if (b.textContent === item.answer) {
              b.classList.add("correct");
            }
          });
        }

        document.getElementById("guessNext").classList.remove("hidden");
      });

      options.appendChild(btn);
    });
  }

  document.getElementById("guessAudio").addEventListener("click", () => {
    speak(guessData[guessIndex].clue);
  });

  document.getElementById("guessNext").addEventListener("click", () => {
    guessIndex++;

    if (guessIndex >= guessData.length) {
      guessIndex = 0;
    }

    renderGuess();
  });

  renderGuess();

  /* =========================================================
     SENTENCE BUILDER
  ========================================================= */

  const sentenceData = [
    ["Pica la cebolla.", "Chop the onion."],
    ["Pela el ajo.", "Peel the garlic."],
    ["Agrega el condimento.", "Add the seasoning."],
    ["Mezcla los ingredientes.", "Mix the ingredients."],
    ["Marina el pollo.", "Marinate the chicken."],
    ["Pon el pollo en el recipiente.", "Put the chicken in the container."],
    ["Pesa el pollo.", "Weigh the chicken."],
    ["Empaca el pollo.", "Pack the chicken."],
    ["Etiqueta el paquete.", "Label the package."],
    ["Ponlo en el refrigerador.", "Put it in the fridge."],
  ];

  let sentenceIndex = 0;
  let selectedWords = [];

  function renderSentence() {
    const item = sentenceData[sentenceIndex];

    document.getElementById("sentenceProgress").textContent =
      `Sentence ${sentenceIndex + 1} of ${sentenceData.length}`;

    document.getElementById("sentencePrompt").textContent = item[0];

    selectedWords = [];

    renderAnswerZone();

    const bank = document.getElementById("wordBank");
    bank.innerHTML = "";

    const words = shuffle(item[1].split(" "));

    words.forEach((word) => {
      const chip = document.createElement("button");
      chip.className = "word-chip";
      chip.textContent = word;

      chip.addEventListener("click", () => {
        selectedWords.push(word);
        chip.style.display = "none";

        renderAnswerZone();
      });

      bank.appendChild(chip);
    });

    document.getElementById("sentenceFeedback").textContent = "";
    document.getElementById("sentenceFeedback").className = "feedback";
    document.getElementById("sentenceNext").classList.add("hidden");
  }

  function renderAnswerZone() {
    const zone = document.getElementById("answerZone");

    zone.innerHTML = "";

    if (!selectedWords.length) {
      zone.innerHTML = `<span class="answer-placeholder">Click the words below...</span>`;

      return;
    }

    selectedWords.forEach((word, index) => {
      const chip = document.createElement("span");
      chip.className = "answer-chip";
      chip.textContent = word;

      chip.addEventListener("click", () => {
        selectedWords.splice(index, 1);

        [...document.querySelectorAll(".word-chip")].forEach((button) => {
          if (button.textContent === word && button.style.display === "none") {
            button.style.display = "block";
            return;
          }
        });

        renderAnswerZone();
      });

      zone.appendChild(chip);
    });
  }

  document.getElementById("checkSentence").addEventListener("click", () => {
    const correct = sentenceData[sentenceIndex][1];

    const userAnswer = selectedWords.join(" ");

    const feedback = document.getElementById("sentenceFeedback");

    if (userAnswer === correct) {
      feedback.textContent = "✓ Excellent! The sentence is correct.";
      feedback.className = "feedback correct-text";

      document.getElementById("sentenceNext").classList.remove("hidden");
    } else {
      feedback.textContent = "Not yet. Check the word order and try again.";

      feedback.className = "feedback wrong-text";
    }
  });

  document.getElementById("sentenceAudio").addEventListener("click", () => {
    speak(sentenceData[sentenceIndex][1]);
  });

  document.getElementById("resetSentence").addEventListener("click", () => {
    renderSentence();
  });

  document.getElementById("sentenceNext").addEventListener("click", () => {
    sentenceIndex++;

    if (sentenceIndex >= sentenceData.length) {
      sentenceIndex = 0;
    }

    renderSentence();
  });

  renderSentence();

  /* =========================================================
     WHAT'S NEXT?
  ========================================================= */

  const nextData = [
    {
      scenario: "You chop the onion. What's next?",
      answer: "Add the ingredients.",
      options: [
        "Add the ingredients.",
        "Put it in the fridge.",
        "Label the package.",
        "Go home.",
      ],
    },
    {
      scenario: "You add the seasoning. What's next?",
      answer: "Mix everything.",
      options: [
        "Mix everything.",
        "Pack the chicken.",
        "Weigh the chicken.",
        "Clean the fridge.",
      ],
    },
    {
      scenario: "You mix the ingredients. What's next?",
      answer: "Add the chicken.",
      options: [
        "Add the chicken.",
        "Label the package.",
        "Put it in the fridge.",
        "Weigh the package.",
      ],
    },
    {
      scenario: "You add the chicken. What's next?",
      answer: "Marinate the chicken.",
      options: [
        "Marinate the chicken.",
        "Pack the package.",
        "Clean the scale.",
        "Label the chicken.",
      ],
    },
    {
      scenario: "You marinate the chicken. What's next?",
      answer: "Put the chicken in a container.",
      options: [
        "Put the chicken in a container.",
        "Label the package.",
        "Weigh the bag.",
        "Chop the fridge.",
      ],
    },
    {
      scenario: "You weigh the chicken. What's next?",
      answer: "Pack the chicken.",
      options: [
        "Pack the chicken.",
        "Peel the chicken.",
        "Chop the package.",
        "Mix the scale.",
      ],
    },
    {
      scenario: "You pack the chicken. What's next?",
      answer: "Label the package.",
      options: [
        "Label the package.",
        "Peel the package.",
        "Chop the bag.",
        "Mix the fridge.",
      ],
    },
    {
      scenario: "You label the package. What's next?",
      answer: "Put it in the fridge.",
      options: [
        "Put it in the fridge.",
        "Cut the label.",
        "Chop the package.",
        "Add the knife.",
      ],
    },
    {
      scenario: "You finish preparing the chicken. What should you do?",
      answer: "Clean the work area.",
      options: [
        "Clean the work area.",
        "Marinate the scale.",
        "Peel the fridge.",
        "Weigh the knife.",
      ],
    },
    {
      scenario: "You cut the chicken. What's a useful next step?",
      answer: "Weigh the chicken.",
      options: [
        "Weigh the chicken.",
        "Peel the chicken.",
        "Chop the fridge.",
        "Label the knife.",
      ],
    },
  ];

  let nextIndex = 0;
  let nextAnswered = false;

  function renderNext() {
    const item = nextData[nextIndex];

    document.getElementById("nextProgress").textContent =
      `Scenario ${nextIndex + 1} of ${nextData.length}`;

    document.getElementById("nextScenario").textContent = item.scenario;

    document.getElementById("nextFeedback").textContent = "";
    document.getElementById("nextFeedback").className = "feedback";

    document.getElementById("nextNext").classList.add("hidden");

    const options = document.getElementById("nextOptions");
    options.innerHTML = "";

    nextAnswered = false;

    item.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;

      btn.addEventListener("click", () => {
        if (nextAnswered) return;

        nextAnswered = true;

        if (option === item.answer) {
          btn.classList.add("correct");

          document.getElementById("nextFeedback").textContent =
            "✓ Correct! Good thinking.";

          document.getElementById("nextFeedback").className =
            "feedback correct-text";
        } else {
          btn.classList.add("wrong");

          document.getElementById("nextFeedback").textContent =
            `The next step is: ${item.answer}`;

          document.getElementById("nextFeedback").className =
            "feedback wrong-text";

          [...options.children].forEach((b) => {
            if (b.textContent === item.answer) {
              b.classList.add("correct");
            }
          });
        }

        document.getElementById("nextNext").classList.remove("hidden");
      });

      options.appendChild(btn);
    });
  }

  document.getElementById("nextAudio").addEventListener("click", () => {
    speak(nextData[nextIndex].scenario);
  });

  document.getElementById("nextNext").addEventListener("click", () => {
    nextIndex++;

    if (nextIndex >= nextData.length) {
      nextIndex = 0;
    }

    renderNext();
  });

  renderNext();

  /* =========================================================
     LISTENING
  ========================================================= */

  const listeningData = [
    {
      audio: "Chop the onion.",
      options: [
        "Peel the garlic.",
        "Chop the onion.",
        "Weigh the chicken.",
        "Pack the meat.",
      ],
      answer: "Chop the onion.",
    },
    {
      audio: "Put the chicken in the container.",
      options: [
        "Put the chicken in the container.",
        "Pack the chicken.",
        "Cut the chicken.",
        "Label the package.",
      ],
      answer: "Put the chicken in the container.",
    },
    {
      audio: "Add the seasoning.",
      options: [
        "Mix the ingredients.",
        "Add the seasoning.",
        "Peel the garlic.",
        "Weigh the chicken.",
      ],
      answer: "Add the seasoning.",
    },
    {
      audio: "Marinate the chicken.",
      options: [
        "Marinate the chicken.",
        "Chop the chicken.",
        "Label the chicken.",
        "Clean the scale.",
      ],
      answer: "Marinate the chicken.",
    },
    {
      audio: "Weigh the chicken.",
      options: [
        "Pack the chicken.",
        "Weigh the chicken.",
        "Put it in the fridge.",
        "Cut the onion.",
      ],
      answer: "Weigh the chicken.",
    },
    {
      audio: "Pack the chicken.",
      options: [
        "Pack the chicken.",
        "Peel the garlic.",
        "Mix the ingredients.",
        "Add the seasoning.",
      ],
      answer: "Pack the chicken.",
    },
    {
      audio: "Label the package.",
      options: [
        "Label the package.",
        "Weigh the package.",
        "Clean the package.",
        "Open the package.",
      ],
      answer: "Label the package.",
    },
    {
      audio: "Put it in the fridge.",
      options: [
        "Put it in the fridge.",
        "Put it on the table.",
        "Pack it again.",
        "Cut it.",
      ],
      answer: "Put it in the fridge.",
    },
    {
      audio: "Clean the work area.",
      options: [
        "Clean the work area.",
        "Weigh the work area.",
        "Pack the work area.",
        "Label the work area.",
      ],
      answer: "Clean the work area.",
    },
    {
      audio: "Take this to the other room.",
      options: [
        "Take this to the other room.",
        "Put this in the fridge.",
        "Cut this meat.",
        "Weigh this.",
      ],
      answer: "Take this to the other room.",
    },
  ];

  let listeningIndex = 0;
  let listeningAnswered = false;

  function renderListening() {
    const item = listeningData[listeningIndex];

    document.getElementById("listenProgress").textContent =
      `Listening ${listeningIndex + 1} of ${listeningData.length}`;

    document.getElementById("listenFeedback").textContent = "";
    document.getElementById("listenFeedback").className = "feedback";

    document.getElementById("listenNext").classList.add("hidden");

    const options = document.getElementById("listenOptions");
    options.innerHTML = "";

    listeningAnswered = false;

    item.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";

      const audioIcon = document.createElement("span");
      audioIcon.textContent = " 🔊";

      btn.textContent = option;
      btn.appendChild(audioIcon);

      btn.addEventListener("click", () => {
        if (listeningAnswered) return;

        listeningAnswered = true;

        if (option === item.answer) {
          btn.classList.add("correct");

          document.getElementById("listenFeedback").textContent =
            "✓ Excellent listening!";

          document.getElementById("listenFeedback").className =
            "feedback correct-text";
        } else {
          btn.classList.add("wrong");

          document.getElementById("listenFeedback").textContent =
            `You heard it differently. The answer is: ${item.answer}`;

          document.getElementById("listenFeedback").className =
            "feedback wrong-text";

          [...options.children].forEach((b) => {
            if (b.textContent.includes(item.answer)) {
              b.classList.add("correct");
            }
          });
        }

        document.getElementById("listenNext").classList.remove("hidden");
      });

      btn.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        speak(option);
      });

      options.appendChild(btn);
    });
  }

  document.getElementById("playListening").addEventListener("click", () => {
    speak(listeningData[listeningIndex].audio, 0.76);
  });

  document.getElementById("listenNext").addEventListener("click", () => {
    listeningIndex++;

    if (listeningIndex >= listeningData.length) {
      listeningIndex = 0;
    }

    renderListening();
  });

  renderListening();

  /* =========================================================
     SPEAKING
  ========================================================= */

  const speakingData = [
    {
      icon: "🏪",
      q: "Where do you work?",
      a: "I work at a meat market.",
    },
    {
      icon: "🍗",
      q: "What do you work with?",
      a: "I work with meat and chicken.",
    },
    {
      icon: "🍗",
      q: "What chicken parts do you prepare?",
      a: "I prepare chicken breast, chicken thigh and chicken wings.",
    },
    {
      icon: "🥗",
      q: "What ingredients do you use?",
      a: "I use onion, garlic, cilantro, parsley and seasoning.",
    },
    {
      icon: "🧅",
      q: "What do you do with the onion?",
      a: "I chop the onion.",
    },
    {
      icon: "🧄",
      q: "What do you do with the garlic?",
      a: "I peel the garlic.",
    },
    {
      icon: "🍗",
      q: "What do you do after you add the seasoning?",
      a: "I mix the ingredients.",
    },
    {
      icon: "📦",
      q: "What do you do after you weigh the chicken?",
      a: "I pack the chicken.",
    },
    {
      icon: "❄️",
      q: "Where do you put the chicken?",
      a: "I put the chicken in the fridge.",
    },
    {
      icon: "🧽",
      q: "What do you do at the end of the work?",
      a: "I clean the work area.",
    },
  ];

  const speakingGrid = document.getElementById("speakingGrid");

  speakingData.forEach((item) => {
    const card = document.createElement("div");
    card.className = "speaking-card";

    card.innerHTML = `
      <div class="speaking-icon">${item.icon}</div>
      <h3>${item.q}</h3>

      <button class="audio-small question-audio">
        🎧 Hear question
      </button>

      <div class="model-answer">
        <strong>Example:</strong><br>
        ${item.a}
        <br><br>
        <button class="audio-small answer-audio">
          🔊 Hear example
        </button>
      </div>
    `;

    card.querySelector(".question-audio").addEventListener("click", () => {
      speak(item.q);
    });

    card.querySelector(".answer-audio").addEventListener("click", () => {
      speak(item.a);
    });

    speakingGrid.appendChild(card);
  });

  /* =========================================================
     WORKPLACE MISSION
  ========================================================= */

  const missionData = [
    {
      instruction: "Clean the table, please.",
      options: [
        "Clean the table.",
        "Weigh the table.",
        "Pack the table.",
        "Label the table.",
      ],
      answer: "Clean the table.",
    },
    {
      instruction: "Weigh this.",
      options: ["Weigh this.", "Cut this.", "Peel this.", "Pack this."],
      answer: "Weigh this.",
    },
    {
      instruction: "Pack these pieces.",
      options: [
        "Pack these pieces.",
        "Chop these pieces.",
        "Peel these pieces.",
        "Mix these pieces.",
      ],
      answer: "Pack these pieces.",
    },
    {
      instruction: "Put it in the fridge.",
      options: [
        "Put it in the fridge.",
        "Put it on the table.",
        "Put it in the oven.",
        "Take it outside.",
      ],
      answer: "Put it in the fridge.",
    },
    {
      instruction: "Take this to the other room.",
      options: [
        "Take this to the other room.",
        "Cut this.",
        "Weigh this.",
        "Label this.",
      ],
      answer: "Take this to the other room.",
    },
    {
      instruction: "Chop the onion.",
      options: [
        "Chop the onion.",
        "Peel the onion.",
        "Weigh the onion.",
        "Pack the onion.",
      ],
      answer: "Chop the onion.",
    },
    {
      instruction: "Peel the garlic.",
      options: [
        "Peel the garlic.",
        "Chop the garlic.",
        "Pack the garlic.",
        "Weigh the garlic.",
      ],
      answer: "Peel the garlic.",
    },
    {
      instruction: "Add the seasoning.",
      options: [
        "Add the seasoning.",
        "Remove the seasoning.",
        "Pack the seasoning.",
        "Weigh the seasoning.",
      ],
      answer: "Add the seasoning.",
    },
    {
      instruction: "Mix the ingredients.",
      options: [
        "Mix the ingredients.",
        "Label the ingredients.",
        "Pack the ingredients.",
        "Weigh the ingredients.",
      ],
      answer: "Mix the ingredients.",
    },
    {
      instruction: "Marinate the chicken.",
      options: [
        "Marinate the chicken.",
        "Label the chicken.",
        "Weigh the chicken.",
        "Pack the chicken.",
      ],
      answer: "Marinate the chicken.",
    },
  ];

  let missionIndex = 0;
  let missionAnswered = false;

  function renderMission() {
    const item = missionData[missionIndex];

    document.getElementById("missionInstruction").textContent =
      item.instruction;

    document.getElementById("missionFeedback").textContent = "";
    document.getElementById("missionFeedback").className = "feedback";

    document.getElementById("missionNext").classList.add("hidden");

    const options = document.getElementById("missionOptions");
    options.innerHTML = "";

    missionAnswered = false;

    item.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;

      btn.addEventListener("click", () => {
        if (missionAnswered) return;

        missionAnswered = true;

        if (option === item.answer) {
          btn.classList.add("correct");

          document.getElementById("missionFeedback").textContent =
            "✓ You understood your supervisor!";

          document.getElementById("missionFeedback").className =
            "feedback correct-text";
        } else {
          btn.classList.add("wrong");

          document.getElementById("missionFeedback").textContent =
            `Listen again. The instruction means: ${item.answer}`;

          document.getElementById("missionFeedback").className =
            "feedback wrong-text";

          [...options.children].forEach((b) => {
            if (b.textContent === item.answer) {
              b.classList.add("correct");
            }
          });
        }

        document.getElementById("missionNext").classList.remove("hidden");
      });

      options.appendChild(btn);
    });
  }

  document.getElementById("missionAudio").addEventListener("click", () => {
    speak(missionData[missionIndex].instruction, 0.76);
  });

  document.getElementById("missionNext").addEventListener("click", () => {
    missionIndex++;

    if (missionIndex >= missionData.length) {
      missionIndex = 0;
    }

    renderMission();
  });

  renderMission();

  /* =========================================================
     FINAL CHALLENGE
  ========================================================= */

  const finalData = [
    {
      q: "What does “chicken thigh” mean?",
      options: ["Muslo de pollo", "Pechuga de pollo", "Ala de pollo", "Piel"],
      answer: "Muslo de pollo",
    },
    {
      q: "What do you do to onion?",
      options: ["Chop it.", "Weigh it.", "Label it.", "Put it in the fridge."],
      answer: "Chop it.",
    },
    {
      q: "Which ingredient do you peel?",
      options: ["Garlic", "Thyme", "Seasoning", "Cilantro"],
      answer: "Garlic",
    },
    {
      q: "What do you use to weigh chicken?",
      options: ["Scale", "Knife", "Tray", "Gloves"],
      answer: "Scale",
    },
    {
      q: "What comes after “Add the seasoning”?",
      options: [
        "Mix the ingredients.",
        "Pack the chicken.",
        "Label the package.",
        "Clean the fridge.",
      ],
      answer: "Mix the ingredients.",
    },
    {
      q: "How do you say “empacar el pollo”?",
      options: [
        "Pack the chicken.",
        "Peel the chicken.",
        "Cut the chicken.",
        "Weigh the chicken.",
      ],
      answer: "Pack the chicken.",
    },
    {
      q: "What does “container” mean?",
      options: ["Recipiente", "Balanza", "Etiqueta", "Cuchillo"],
      answer: "Recipiente",
    },
    {
      q: "Which one has the long bone?",
      options: [
        "Chicken drumstick",
        "Chicken breast",
        "Chicken wing",
        "Chicken skin",
      ],
      answer: "Chicken drumstick",
    },
    {
      q: "What do you do after packing the chicken?",
      options: [
        "Label the package.",
        "Peel the chicken.",
        "Chop the package.",
        "Mix the package.",
      ],
      answer: "Label the package.",
    },
    {
      q: "What do you do at the end of the work?",
      options: [
        "Clean the work area.",
        "Weigh the table.",
        "Peel the fridge.",
        "Pack the knife.",
      ],
      answer: "Clean the work area.",
    },
  ];

  let finalIndex = 0;
  let finalScore = 0;
  let finalAnswered = false;

  function renderFinal() {
    const item = finalData[finalIndex];

    document.getElementById("finalProgress").textContent =
      `Challenge ${finalIndex + 1} of ${finalData.length}`;

    document.getElementById("finalQuestion").textContent = item.q;

    document.getElementById("finalFeedback").textContent = "";
    document.getElementById("finalFeedback").className = "feedback";

    document.getElementById("finalNext").classList.add("hidden");

    const options = document.getElementById("finalOptions");
    options.innerHTML = "";

    finalAnswered = false;

    item.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;

      btn.addEventListener("click", () => {
        if (finalAnswered) return;

        finalAnswered = true;

        if (option === item.answer) {
          btn.classList.add("correct");
          finalScore++;

          document.getElementById("finalFeedback").textContent = "✓ Correct!";

          document.getElementById("finalFeedback").className =
            "feedback correct-text";
        } else {
          btn.classList.add("wrong");

          document.getElementById("finalFeedback").textContent =
            `The correct answer is: ${item.answer}`;

          document.getElementById("finalFeedback").className =
            "feedback wrong-text";

          [...options.children].forEach((b) => {
            if (b.textContent === item.answer) {
              b.classList.add("correct");
            }
          });
        }

        document.getElementById("finalNext").classList.remove("hidden");
      });

      options.appendChild(btn);
    });
  }

  document.getElementById("finalAudio").addEventListener("click", () => {
    speak(finalData[finalIndex].q);
  });

  document.getElementById("finalNext").addEventListener("click", () => {
    finalIndex++;

    if (finalIndex >= finalData.length) {
      document.querySelector(".final-card").classList.add("hidden");
      document.getElementById("finalResult").classList.remove("hidden");

      document.getElementById("resultText").textContent =
        `You got ${finalScore} out of ${finalData.length} questions correct.`;

      return;
    }

    renderFinal();
  });

  renderFinal();

  /* =========================================================
     GLOBAL PROGRESS
  ========================================================= */

  function updateProgress() {
    const completedSections = [
      quizScore > 0,
      matchRound > 0,
      sentenceIndex > 0,
      nextIndex > 0,
      listeningIndex > 0,
      missionIndex > 0,
      finalScore > 0,
    ].filter(Boolean).length;

    const percentage = Math.min(100, Math.round((completedSections / 7) * 100));

    document.getElementById("globalProgress").style.width = percentage + "%";

    document.getElementById("progressText").textContent = percentage + "%";
  }
});
