# AI TrendScout
 ### Check out the webpage [here](https://ai-trend-scout.venkateshraju.me/)
 
**AI TrendScout** automatically tracks the latest trending topics from across the web including **GitHub**, **Hacker News**, **YouTube**, and **Dev.to**  and displays them in one beautiful, easy-to-digest dashboard.

Whether you're a developer, tech enthusiast, or startup founder, AI TrendScout keeps you in the loop. No noise, just signal.

---

## ✨ Features

- 🔥 **Trending GitHub Projects** – Discover what’s hot in open source  
- 📰 **Top Hacker News Posts** – Daily insights from the tech community  
- 📺 **YouTube Tech Videos** – Stay updated with engaging content  
- ✍️ **Dev.to Articles** – Latest from developer blogs and tutorials  
- 📩 **Newsletter Ready** – Users can subscribe for weekly or daily updates  
---

## 🖼️ Webpage Preview

![Webpage Preview](https://res.cloudinary.com/dy0xvvpe6/image/upload/v1750406471/Screenshot_2025-06-20_133007_mdffxo.png)

---

## 🔧 How It Works

1. **Automated Curation (n8n Workflow)**  
   Scheduled triggered n8n workflow fetches trending content from key platforms.

2. **Supabase Storage**  
   The curated content is saved as a JSON file in Supabase object storage.

3. **Frontend**  
   The Next.js app fetches and displays this JSON file with clean, responsive UI.

4. **Email Subscription**  
   User emails and preferences are stored in Supabase for future newsletter campaigns.

---

## 🛠️ Tech Stack

-  **n8n** for workflow automation  
-  **Supabase** for storage & DB  
-  **Next.js** frontend  
-  **AWS EC2** for n8n workflow deployment  
-  **Vercel** for webpage deployment  

---

## 💻 Local Development

1. Clone this repository
```bash
git clone https://github.com/venkateshraju04/ai-trend-scout.git
cd ai-trend-scout
cd frontend
```
2. Create .env.local file in frontend directory with following keys.
``` 
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
3. Run the Next.js app
```bash
npm install
npm run dev
```
4. Deploy n8n workflow
   - Create a new web service using existing n8n docker image or public git repo of n8n.
   - Leave all the settings default.
   - Add the following env variables and deploy.

   ```
   YOUTUBE_API_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
    N8N_BASIC_AUTH_ACTIVE=true
    N8N_BASIC_AUTH_USER=
    N8N_BASIC_AUTH_PASSWORD=  
    N8N_HOST=0.0.0.0
    N8N_PORT=10000
    N8N_PROTOCOL=https
    WEBHOOK_URL=https://<project-name>.onrender.com
    N8N_EDITOR_BASE_URL=https://<project-name>.onrender.com
   ```
5. Setup an account and import the n8n_workspace.json file available in the root directory.
6. Setup essential api keys and activate your workflow.
