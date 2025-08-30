import React, { useState, useEffect } from 'react';

function CalorieFront() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState('');
  const [calUser, setCalUser] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [combos, setCombos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  const api = 'https://fastfood-calorie-combos-fasfood-combo.onrender.com/api';

  useEffect(() => {
    RestruantInfo();
  }, []);
  //
  //

  const RestruantInfo = async () => {
    try {
      setLoading(true);
      const getting = await fetch(`${api}/restaurants`);

      if (!getting.ok) {
        throw new Error(`Server responded with ${getting.status}`);
      }

      const menuInfo = await getting.json();
      setRestaurants(menuInfo.restaurants || []);

      if (menuInfo.restaurants && menuInfo.restaurants.length > 0) {
        setRestaurant(menuInfo.restaurants[0].id);
      }
    } catch (error) {
      console.error('failed to get restaurants:', error);

      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const MenuItemsInfo = async () => {
    if (!restaurant) {
      setError('Please select a restaurant first');
      return [];
    }

    try {
      const url = `${api}/menu/${restaurant}/filter?maxCalories=${calUser || 0}`;
      const getting = await fetch(url);
      const data = await getting.json();
      setMenuItems(data.items || []);

      const items = data.items || [];
      const groupedFood = {};

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!groupedFood[item.category]) groupedFood[item.category] = [];
        groupedFood[item.category].push({
          id: item._id || item.name,
          name: item.name,
          cals: item.calories,
        });
      }

      setGrouped(groupedFood);
      return items;
    } catch (error) {
      console.error('failed to load menu:', error);
      setError('failed to load menu items');
      return [];
    }
  };

  const calorieFilteredmenu = async () => {
    try {
      await fetch(`${api}/classify-menu/${restaurant}`, { method: 'POST' });
      await MenuItemsInfo();
      return true;
    } catch (error) {
      console.error('Classification failed:', error);
      return false;
    }
  };

  const generateCombos = async () => {
    setError('');

    if (!restaurant) {
      setError('Please select a restaurant first');
      return;
    }

    if (!calUser) {
      setError('Please enter a calorie target first');
      return;
    }

    try {
      const items = await MenuItemsInfo();

      if (items.length === 0) {
        const classificationSuccess = await calorieFilteredmenu();
        if (!classificationSuccess) {
          setError('Menu classification failed');
          return;
        }
      }

      const response = await fetch(`${api}/generate-combos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantKey: restaurant,
          targetCalories: parseInt(calUser),
          comboCount: 3,
        }),
      });

      const data = await response.json();

      if (data.combos && data.combos.length > 0) {
        const userCombos = data.combos.map((combo) => ({
          total: combo.totalCalories,
          items: combo.items.map((item) => ({
            id: item.name,
            name: item.name,
            cals: item.calories,
          })),
        }));
        setCombos(userCombos);
      } else {
        setError('No combos generated. Try a higher calorie target or different restaurant.');
      }
    } catch (error) {
      console.error('Failed to generate combos:', error);
      setError('Failed to generate combos');
    }
  };

  return (
    <div className="min-h-screen bg-pink-950 font-sans text-pink-100">
      {/* Header */}
      <header className="w-full border-b border-pink-800 bg-pink-900 shadow">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <h1 className="mr-auto text-2xl font-extrabold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
            Calorie Combo<span className="text-pink-400">.</span>
          </h1>
          <label className="text-sm text-pink-300">
            Restaurant
            <select
              className="ml-2 rounded-md border border-pink-700 bg-pink-950 px-3 py-2 text-sm text-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              disabled={loading} // Disable while loading
            >
              {loading ? (
                <option value="">Loading restaurants...</option>
              ) : restaurants.length > 0 ? (
                restaurants.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))
              ) : (
                <option value="">No restaurants available</option>
              )}
            </select>
          </label>
          <label className="text-sm text-pink-300">
            Calories
            <input
              type="number"
              min={100}
              className="ml-2 w-28 rounded-md border border-pink-700 bg-pink-950 px-3 py-2 text-sm text-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={calUser}
              onChange={(e) => setCalUser(e.target.value)}
              placeholder="Enter calories"
            />
          </label>
          <button
            onClick={MenuItemsInfo}
            disabled={!restaurant || loading}
            className="bg-pink-600/20 text-pink-300 px-4 py-2 rounded-full font-medium text-sm hover:bg-pink-600/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load Menu'}
          </button>
        </div>
      </header>


      <main className="relative mx-auto max-w-5xl px-2 pb-20">
        {/** takes care of the square that will show all the generation of combos */}
        <section className="relative w-full max-w-xl mx-auto rounded-xl border border-pink-700 bg-pink-900/60 px-6 py-4 shadow-xl mb-8">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-pink-400">
              Your Calorie Combo
            </h2>
            <button
              onClick={generateCombos}
              disabled={!restaurant || !calUser || loading}
              className="bg-pink-600 text-pink-100 px-4 py-2 rounded-full font-medium text-sm hover:bg-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Combo
            </button>
          </header>

          {combos.length === 0 && (
            <p className="mt-3 border-t border-pink-700 pt-3 text-sm text-pink-300">
              <span className="font-semibold">Generate Combo</span> to create up to three meal combos under{" "}
              <span className="font-semibold">{calUser || '___'} cal</span>.
            </p>
          )}

          {error && (
            <div className="bg-rose-900 border border-rose-700 text-rose-300 px-4 py-3 rounded-xl mx-4 mt-4 shadow-lg">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {combos.length > 0 && (
            <ul className="mt-3 space-y-3 border-t border-pink-700 pt-3">
              {combos.map((combo, idx) => (
                <li key={idx} className="rounded-lg border border-pink-700 bg-pink-950/50 p-3">
                  <div className="mb-1 text-sm font-bold">
                    Combo {idx + 1} · <span className="text-pink-400">{combo.total} cal</span>
                  </div>
                  <ul className="text-sm text-pink-200 list-disc ml-5">
                    {combo.items.map((it) => (
                      <li key={it.id}>
                        {it.name} <span className="text-pink-400/70">({it.cals} cal)</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/** takes care of the square that will show all the generation of menu*/}
        <section className="relative rounded-xl border border-pink-700 bg-pink-900 px-6 py-8 shadow-xl mt-3">
          <h2 className="mb-6 text-center text-2xl font-extrabold text-pink-400">
            Menu Under {calUser || '___'} Calories
          </h2>

          {Object.keys(grouped).length === 0 && (
            <p className="col-span-2 text-center py-8 text-pink-400/60">
              No menu items found. Click "Load Menu" to load the menu.
            </p>
          )}

          {Object.keys(grouped).length > 0 && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {Object.entries(grouped).map(([cat, items]) => (
                <section key={cat}>
                  <h3 className="mb-2 text-center text-lg font-bold uppercase tracking-widest text-pink-300">
                    {cat}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((it) => (
                      <li
                        key={it.id}
                        className="flex items-baseline justify-between border-b border-pink-800 pb-1"
                      >
                        <span className="font-medium">{it.name}</span>
                        <span className="text-pink-400">{it.cals} cal</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CalorieFront;