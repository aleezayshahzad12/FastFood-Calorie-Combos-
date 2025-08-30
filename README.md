# FastFood-Calorie-Combos

**Full-stack, AI-integrated calorie-focused meal combo generator** that lets users enjoy fast-food restaurants while staying within desired calorie targets.

**🚀 Impact:** Reduces repeated AI calls by over **80%**, eliminates manual calorie tracking, and delivers personalized meal combos tailored to user calorie targets, breaking the belief that dieting means giving up favorite restaurants.


## 🌟 Why This Project Stands Out

- **Automated AI Menu Classification:** Menu items fetched from APIs are automatically classified into categories (main, side, drink, dessert, sauce) with restaurant-specific handling.  
- **Caching for Efficiency:** AI classification is stored in MongoDB after the first run, avoiding repeated API calls and reducing both response time and costs.
- **Advanced Combo Generation:** Generates calorie-specific meal combos using restaurant-aware patterns, fallback strategies, and BYO templates when menu data is limited.   
- **Performance-Optimized:** Stores successful combos and reuses them when new generations fall short, ensuring fast, reliable results.
- **Production-Ready:** Deployed backend + frontend for immediate use  
  
## 🛠 Tech Stack
- **Frontend:** React + Vite + Tailwind CSS (responsive UI + combo dashboard)  
- **Backend:** Node.js + Express.js (RESTful with AI classification and combo generation logic)  
- **Database:** MongoDB + Mongoose  
- **Authentication & Security:** JWT, bcryptjs  
- **Integrations:** OpenAI (OpenAI GPT models for menu classification) and  Nutritionix API (menu items)  
- **Deployment:** Render+ Netlify  

## ⚡ Key Features
- **Automated Menu Classification** – AI labels all menu items by category and restaurant.
- **Pattern-Based Combo Generation:** – Uses pre-defined patterns (e.g., main + side + drink, main + dessert) to generate balanced meal combos.
- **BYO Templates Support:** – Custom “Build Your Own” combos to handle API limitations.
- **Calorie-Aware:** – Combos are intelligently generated to stay within user-specified calorie ranges.
- **Caching & Combo Memory:**
      - Remembers successful combos for each restaurant/calorie combination
      - Adapts attempt limits based on previous generation success
      - Reuses valid combos if new generation falls short
- **Duplicate Prevention:** – Prevents generation of duplicate combos beyond allowed limits.
- **Pattern-Flexible:** – : Easy to add new restaurant types and meal patterns.

### 📌 User Experience

- **Simple Workflow** 
      1. User selects a supported restaurant.
      2. Enters desired calorie range.
      3. Clicks “**Load Menu**” → filtered menu items for that range are displayed.
      4. Clicks “Generate Combos” → calorie-compliant meal combos are generated.
- **Interactive & Flexible:** - Users can regenerate combos multiple times; duplicates are automatically avoided, and combos adhere to calorie limits

- **Health-Friendly:** - Enables users to enjoy favorite fast foods without exceeding calorie goals, supporting health or weight management efforts.


### 🤖 AI & Automation
- Fully automated menu classification ensures accurate, restaurant-specific labeling.

- Caching reduces API calls and response times.

- Combo generation intelligently balances calorie constraints with meal variety.

- Multiple fallback strategies ensure combos are always generated, even with limited menu items.


 ## 🔌 APIs & Services
- **OpenAI API:** AI-powered menu classification
- **Nutritionix API:** Menu and nutritional data 

## 🛠 Development Tools
- **dotenv:** Environment variable management  
- **CORS:** Cross-origin resource sharing  
- **Axios:** HTTP client
- **Deployment:** Render and Netlify


## 🏗️ Architecture  
The platform follows a RESTful API architecture with:  
- **React Frontend**: Responsive client interface 
- **Express Backend**: Handles integrations with AI classification, pattern-based combo generation, caching, and BYO support  
- **MongoDB Database**: Stores menu classifications and previously generated combos
- **Third-party Integrations**: Menu and nutritional data  


## 🔧 Installation & Setup
```bash
# 1) Clone the repository
git clone https://github.com/your-username/FastFood-Calorie-Combos.git
cd FastFood-Calorie-Combos

# 2) Install dependencies
npm install

# 3) Set up environment variables
cp .env.example .env
 Configure your API keys and database URI

# 4)  Start development servers
npm run dev  # Frontend (Vite)
npm run index  # Backend (Node.js)
```

## 📁 Environment Variables
Create a .env file with:
```bash
env
MONGODB_URI=your_mongodb_connection_string

OPENAI_API_KEY=your_openai_api_key

NUTRITIONIX_APP_ID=your_nutritionix_app_id

NUTRITIONIX_APP_KEY=your_nutritionix_app_key

PORT=3000
```

## 📄 License
MIT License © 2025 Aleezay Shahzad

## 🏆 Acknowledgments
OpenAI for menu classification

Nutritionix for menu and nutrition data

MongoDB for caching and efficient storage



