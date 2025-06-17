# 🧠 AI Workforce Assistant for Nonprofits

An AI-powered assistant built by **Gemstone Consulting Services** to support nonprofits with workforce training, digital skills, and client support automation. This project helps your organization deploy a private GPT assistant trained on your knowledge base — no coding required.

---

## 🌟 Features

- ChatGPT-powered assistant tailored for nonprofits
- Upload your own resources, policies, or curriculum
- Customize branding (logo, title, color theme)
- Easy integration with OpenAI API
- Secure optional page password (`CODE`)
- Fully responsive, works on desktop and mobile
- Built on top of [Next.js](https://nextjs.org/) and OpenAI Assistants API

---

## 🚀 Get Started

1. **Get an OpenAI API Key**:  
   👉 https://platform.openai.com/account/api-keys

2. **Deploy your private instance** using one of the buttons below:

   [<img src="https://vercel.com/button" alt="Deploy on Vercel" height="30">](https://vercel.com/new/clone?repository-url=https://github.com/gemstone-ceo/gemstone-ceo&env=OPENAI_API_KEY,CODE&project-name=aiworkforceassistantfornonprofits&repository-name=gemstone-ceo)

   [<img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod" height="30">](https://gitpod.io/#https://github.com/gemstone-ceo/gemstone-ceo)

3. (Optional) Use the `CODE` environment variable to set a password for access.

---

## 🖼 Screenshot

![AI Workforce Assistant Interface](public/screenshot.png)

---

## 🛠 Configuration

You can customize your deployment with the following environment variables:

| Name              | Required | Description                                  |
|-------------------|----------|----------------------------------------------|
| `OPENAI_API_KEY`  | ✅       | Your OpenAI secret key                       |
| `CODE`            | Optional | Page access password (used for security)     |

To change branding (logo, title, color, meta tags), edit:

- `/app/layout.tsx` → update `<title>`, `<meta>`, and favicon
- `/app/components/sidebar.tsx` → replace sidebar logo
- `/public/favicon.ico` → replace with your logo icon
- `/app/components/home.tsx` → homepage headline & subheadline

---

## 🔐 Deploy for Your Clients

If you're offering white-labeled deployments:

- Duplicate this repo and rename it per client
- Replace the logo and update the `/public` assets
- Upload a client-specific knowledge base (PDFs or prompts)
- Deploy using the Vercel link above and set `CODE` if needed

---

## 📂 Folder Structure (Key Files)

/public
└── favicon.ico → Custom favicon
└── gemstone-logo.png → Logo image

/app
└── layout.tsx → Page title, meta, theme
└── components/
├── home.tsx → Homepage header + intro
├── sidebar.tsx → Sidebar branding (logo, title)
└── chat.tsx → Chat interface


---

## 📣 About Gemstone Consulting Services

**Gemstone Consulting Services** helps nonprofits and small businesses grow using automation, AI tools, and digital systems.  
🔗 https://gemstoneconsultingservices.com

---

## 📄 License

This project is for private deployment only. Commercial resale requires permission from Gemstone Consulting Services.  
© 2025 Gemstone Consulting Services. All rights reserved.

