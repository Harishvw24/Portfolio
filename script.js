const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  });
});

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
    document.querySelectorAll('.project-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const chatLauncher = document.querySelector('.chat-launcher');
const chatPanel = document.querySelector('#chat-panel');
const chatClose = document.querySelector('.chat-close');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('#chat-messages');
const chatSuggestions = document.querySelector('.chat-suggestions');
const sendButton = chatForm.querySelector('button');

function setChatOpen(isOpen) {
  chatPanel.hidden = !isOpen;
  chatLauncher.setAttribute('aria-expanded', String(isOpen));
  chatLauncher.setAttribute('aria-label', isOpen ? 'Close portfolio assistant' : 'Open portfolio assistant');
  if (isOpen) chatInput.focus();
  else chatLauncher.focus();
}

chatLauncher.addEventListener('click', () => setChatOpen(chatPanel.hidden));
chatClose.addEventListener('click', () => setChatOpen(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !chatPanel.hidden) setChatOpen(false);
});

function addMessage(text, kind) {
  const article = document.createElement('article');
  article.className = `chat-message ${kind}-message`;
  const label = document.createElement('span');
  label.className = 'message-label';
  label.textContent = kind === 'assistant' ? 'ASSISTANT' : 'YOU';
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  article.append(label, paragraph);
  chatMessages.append(article);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function answerQuestion(question) {
  const q = question.toLowerCase();
  if (/venwave|pharmacy|pharma|agentic|healthcare/.test(q)) {
    return 'Venwave is a cloud-native pharmacy operating system and agentic AI workflow engine. It includes a searchable catalog of more than 450,000 medicines, batch-level FEFO tracking, vendor bill parsing, and agents for WhatsApp orders, store queries, and debt collection. I’m the founder and lead product engineer.';
  }
  if (/prototype|startup|another app|application/.test(q)) {
    return 'My selected work includes Venwave, a multi-agent orchestration framework, an EV material selection platform, Tomato food delivery, a real-time chat app, and VisitHyderabad. The project cards link to their GitHub repositories.';
  }
  if (/market|finance|invest|trading|business/.test(q)) {
    return 'I’m a software engineer who follows how markets work and how businesses create value. That context shapes the questions I ask when building software: who needs it, what changes their behavior, and how the system holds up in the real world.';
  }
  if (/experience|background|about|who are you|yourself/.test(q)) {
    return 'I’m Harish, a Full-Stack & AI Systems Engineer based in Hyderabad, India. I work from architecture through full-stack implementation and AI automation. I’m also the founder and lead product engineer at Venwave.';
  }
  if (/skill|stack|technology|tech|program|code|engineering/.test(q)) {
    return 'My core stack includes React, Next.js, Node.js, Express, MongoDB, and PostgreSQL. I also work with JavaScript, Redis, agentic AI, and RAG pipelines; project cards list additional project-specific technologies.';
  }
  if (/project|work|portfolio|build|personal/.test(q)) {
    return 'The portfolio features Venwave and five selected projects: MultiAgent, Tomato, Chat App, EV Material & Chassis Selector, and VisitHyderabad. Each project card links to its repository when available.';
  }
  if (/hire|available|opportunit|contact|email|reach|collaborat/.test(q)) {
    return 'I’m open to conversations about full-stack product engineering, AI agent workflows, and scaling products. Email harishtingirikar2021@gmail.com or call 9392516148. You can also find me on LinkedIn from the contact section.';
  }
  if (/hello|hi|hey|thanks|thank you/.test(q)) {
    return 'Hey! What would you like to know about Venwave, my product work, engineering background, or market interests?';
  }
  return 'I can answer questions about my engineering background, Venwave, the projects, my technology stack, or getting in touch. I only know what’s included on this portfolio.';
}

function sendQuestion(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  addMessage(cleanQuestion, 'user');
  chatInput.value = '';
  sendButton.disabled = true;
  chatSuggestions.querySelectorAll('button').forEach((button) => { button.disabled = true; });
  window.setTimeout(() => {
    addMessage(answerQuestion(cleanQuestion), 'assistant');
    sendButton.disabled = false;
    chatSuggestions.querySelectorAll('button').forEach((button) => { button.disabled = false; });
    chatInput.focus();
  }, 320);
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  sendQuestion(chatInput.value);
});
chatSuggestions.addEventListener('click', (event) => {
  const suggestion = event.target.closest('button');
  if (suggestion) sendQuestion(suggestion.textContent);
});

const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(contactForm);
  const recipient = contactForm.dataset.recipient;
  const subject = `Portfolio inquiry: ${fields.get('topic')}`;
  const body = [
    `Hi, I’m ${fields.get('name')}.`,
    `You can reach me at ${fields.get('email')}.`,
    '',
    fields.get('message'),
  ].join('\n');

  formNote.textContent = `Opening an email draft to ${recipient}. Send it from your email app to complete your message.`;
  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
