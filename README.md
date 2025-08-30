# FastFood-Calorie-Combos
fastfoodcombogenerator.netlify.app

**Full-stack, AI-integrated calorie-focused meal combo generator** that lets users enjoy fast-food restaurants while staying within desired calorie targets.

**🚀 Impact:** Reduces repeated AI calls by over **80%**, eliminates manual calorie tracking, and delivers personalized meal combos tailored to user calorie targets, breaking the belief that dieting means giving up favorite restaurants.


## 🌟 Why This Project Stands Out

- **🤖 Automated AI Menu Classification:** Menu items fetched from APIs are automatically classified into categories (main, side, drink, dessert, sauce) with restaurant-specific handling.  
- **💾 Smart Caching:** AI classification is stored in MongoDB after the first run, avoiding repeated API calls and reducing both response time and costs.
- **Advanced Combo Generation:** Generates calorie-specific meal combos using restaurant-aware patterns, fallback strategies, and BYO templates when menu data is limited.   
- **Performance-Optimized:** Stores successful combos and reuses them when new generations fall short, ensuring fast, reliable results.
- **Production-Ready:** Fully deployed and ready to use
  
## 🚀 Quick Start

1. **Select a restaurant** from the dropdown
2. **Enter your calorie target** (e.g., 700 calories)
3. Clicks “**Load Menu**” → filtered menu items for that range are displayed.
4. **Click "Generate Combos"**  to get calorie-compliant meal combos.
5. **Regenerate combos multiple times** and duplicates are automatically avoided. 
6. **Enjoy** your personalized fast-food meal within your goals!
  
## 🛠 Tech Stack
- **Frontend:** React + Vite + Tailwind CSS (responsive UI + combo dashboard)  
- **Backend:** Node.js + Express.js (RESTful with AI classification and combo generation logic)  
- **Database:** MongoDB + Mongoose  
- **Authentication & Security:** JWT, bcryptjs  
- **Integrations:** OpenAI (OpenAI GPT models for menu classification) and  Nutritionix API (menu items)  
- **Deployment:** Render+ Netlify
-  
## 🎯 Key Features

### Automated AI Classification
- Menu items automatically categorized into: main, side, drink, dessert, sauce
- Restaurant-specific logic for optimal categorization
- One-time classification with MongoDB caching

### Intelligent Combo Generation
- Pattern-based combo creation (main + side + drink, etc.)
- Calorie-aware algorithm ensures target compliance
- BYO (Build-Your-Own) templates for restaurants like Chipotle/Cava

### Performance Optimized
- Combo caching prevents redundant calculations
- Adaptive attempt limits based on generation history
- Fallback strategies guarantee combo delivery

## 📋 Supported Restaurants

- McDonald's
- Taco Bell
- Burger King
- Wendy's
- Chick-fil-A
- Chipotle
- Cava
- Pizza Hut
- Domino's
- KFC
- Panda Express


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



