export const japanese = {
  Language: "言語",
  Debug: "デバッグ",
  "Base:": "基本積載重量：",
  Overload: "過積載",
  "Only the last offer may end overloaded; the 150% limit is not confirmed.":
    "過積載が許容されるのは最後の交換後のみです。150%の上限は未確認です。",
  "The 150% limit is a temporary planning assumption, not a confirmed game limit. Cargo must fit at departure and before each offer; a single offer can be exchanged in a batch. Breezy Sail is unavailable while overloaded.":
    "150%の上限は計画用の暫定値で、ゲーム内の上限としては確認されていません。出港時と各交換の前に、積載重量が通常の上限内に収まっている必要があります。同じ交換条件で複数回分をまとめて交換できます。過積載中は快速巡航を使用できません。",
  "The multi-stop route planner only allows overload after the last offer, within this provisional limit.":
    "複数の寄港地を巡る航路では、最後の交換後に限り、この暫定上限までの過積載を許容します。",
  "This proposed exchange makes the route exceed an allowed cargo limit.":
    "この交換を追加すると、航路の積載重量が許容上限を超えます。",
  "Use {count} starting exchanges or units instead":
    "代わりに、開始時の交換回数または個数を{count}にする",
  "No fitting quantity was found within the search limit. Reduce it further or change the route.":
    "探索範囲内では、積載上限に収まる数量が見つかりませんでした。数量をさらに減らすか、航路を変更してください。",
  "Reducing this addition alone cannot make the route fit; adjust the existing route or ship capacity.":
    "今回の追加分だけを減らしても積載上限内に収まりません。追加済みの航路か船舶の最大積載重量を調整してください。",
  "Cargo overview: saved route only": "積載の概要（追加済みの航路のみ）",
  "Cargo overview includes this unsaved exchange":
    "積載の概要には、まだ追加していないこの交換も含まれます",
  "The saved route exceeds a cargo limit. Try reducing the last added stop.":
    "追加済みの航路で積載上限を超えています。最後に追加した寄港地での交換回数を減らしてみてください。",
  "Change the last added stop to {count} exchanges":
    "最後に追加した寄港地での交換回数を{count}回に変更",
  "Reducing this stop alone cannot make the route fit; adjust another stop or ship capacity.":
    "この寄港地での交換回数だけを減らしても積載上限内に収まりません。別の寄港地での交換回数か船舶の最大積載重量を調整してください。",
  "Exchange count": "交換回数",
  "Reduce exchange count": "交換回数を減らす",
  "Increase exchange count": "交換回数を増やす",
  "Debug mode: allow custom ratios": "デバッグモード：交換比率の手動入力を許可",
  "For Tier 0 exchanges, include the land materials in pre-loaded cargo. Their weight stays counted throughout the calculation, even after exchange; results are conservative only if all materials are included.":
    "0段階の交換では、陸地材料を積載済み貨物に含めてください。交換後も、その重量は計算に含まれ続けます。すべての材料を含めた場合に限り、安全側の見積もりになります。",
  "Number of Tier 0 exchanges": "0段階の交換回数",
  "Included in pre-loaded cargo": "積載済み貨物に含まれています",
  "No preset is available for this offer. Enable debug mode to enter its ratio.":
    "この交換には既定の比率がありません。デバッグモードを有効にして比率を入力してください。",
  "Voyage cargo overview": "航路の積載概要",
  "Peak cargo during route": "航路上の最大積載重量",
  "Additional cargo for the whole route": "航路全体で積める追加貨物",
  "Cargo after this stop": "この寄港地での交換後の積載重量",
  "Cargo space cannot be calculated until the weight and ship capacity are known.":
    "アイテムの重量と船舶の最大積載重量が分かるまで、積載の余裕は計算できません。",
  "{weight} LT above normal capacity": "通常の上限を{weight} LT超過",
  "{weight} LT free at this weight": "この積載重量で残り{weight} LT",
  "Additional cargo is the most you can add at departure and keep aboard throughout this planned route. It is not another calculated exchange; item slots and offer requirements still apply.":
    "追加貨物は、出港時に積み込んで予定の航路全体を通して船に載せておける最大重量です。この値に追加の交換は含まれません。空きスロットや交換条件も確認してください。",
  "This route already exceeds an allowed limit; reduce the load or change the route before adding more cargo.":
    "この航路はすでに許容上限を超えています。貨物をさらに積む前に、積載量を減らすか航路を変更してください。",
  "Special Barter requirements": "突発物々交換の条件",
  "The April 16, 2026 update changed Special Barter requirements to gold bars or Level 4 goods. Confirm the required items and the reward in game.":
    "2026年4月16日のアップデートで、突発物々交換に必要なアイテムが金塊または4段階交易品に変更されました。必要なアイテムと報酬はゲーム内で確認してください。",
  "Source: Pearl Abyss patch notes": "出典：Pearl Abyssのアップデート情報",
  "Only starting units used by the first exchange are loaded. Unused intermediate goods remain aboard; check the route weight and offer limits below.":
    "最初の交換で使う分だけを積み込みます。途中の交換で余った交易品は船に残ります。下の航路の積載重量と交換回数の上限を確認してください。",
  "Optional offer limit": "交換回数の上限（任意）",
  "The Level {level} offer has no remaining exchanges.":
    "{level}段階の交換に残り回数がありません。",
  "Select the starting and final levels. The calculator adds each exchange in between; repeat to add independent trades.":
    "開始段階と最終段階を選択すると、間の各交換が追加されます。独立した交換を追加するには、この操作を繰り返してください。",
  "Minimum level": "最小段階",
  "Starting units for this route": "この航路に積む開始アイテムの個数",
  "Choose the ratio for each offer": "各交換の比率を選択",
  "Ratios are suggestions. Select the amounts shown in each in-game offer.":
    "比率は目安です。ゲーム内の各交換に表示されている数量を選択してください。",
  "Not enough Level {level} goods for this ratio: {available} available, {required} required.":
    "この比率での交換に必要な{level}段階交易品が足りません。所持数は{available}個、必要数は{required}個です。",
  "Enter positive whole numbers for the starting quantity and each ratio.":
    "開始数量と交換比率の各数量には、正の整数を入力してください。",
  "Automatic exchange preview": "交換の自動プレビュー",
  "Add exchanges to route": "航路に交換を追加",
  "Barter route unlocks": "交易路の解放条件",
  "Total completed exchanges, according to the community guide. Routes are separate from item levels; availability can depend on refreshes.":
    "コミュニティガイドに基づく累積交換回数です。交易路と交易品の段階は別の区分です。利用できる交易路は、物々交換情報の更新状況によって変わる場合があります。",
  "Route {number}": "交易路 {number}",
  "Special Barter may start appearing at around 140 completed exchanges; offers appear randomly. The game shows the available items and quantities.":
    "累積交換回数が約140回になると、突発物々交換が出現し始める場合があります。交換内容はランダムです。交換できるアイテムと数量はゲーム内に表示されます。",
  "Brilliant Rock Salt Ingots and Brilliant Pearl Shards: the guide lists 1,000 barters for ship material refreshes and 1,500 for trade item refreshes.":
    "派手な岩塩の塊と派手な真珠結晶について、ガイドでは船舶材料の交換リストの更新に累積1,000回、交易品交換の更新に累積1,500回の物々交換が必要とされています。",
  "Source: Black Desert Foundry bartering guide": "出典：Black Desert Foundryの物々交換ガイド",
  "The multi-stop route planner only allows overload after the last exchange, within this provisional limit.":
    "複数の寄港地を巡る航路では、最後の交換後に限り、この暫定上限までの過積載を許容します。",
  "The final exchange exceeds normal capacity but remains within the provisional overload limit.":
    "最後の交換後の積載重量は通常の上限を超えますが、過積載の暫定上限内に収まります。",
  "Choose a trade calculator": "物々交換の計算方法を選択",
  "Single trade": "単独交換",
  "Tier chain": "段階別の連続交換",
  "Multiple trades": "複数の交換",
  "Add an exchange to your route": "航路に交換を追加",
  "Enter each offer and its number of exchanges. Add them in the order you will visit them.":
    "各交換の条件と回数を入力し、寄港順に追加してください。",
  "Number of exchanges": "交換回数",
  "Use matching goods from earlier stops": "前の寄港地で入手した同じ交易品を使う",
  "Only reuse goods when they are the exact items requested by the offer. The calculator matches levels, not item names. Turn this off to load separate goods for this stop.":
    "交換に指定されたアイテムと完全に一致する場合に限り、前の寄港地で入手した交易品を使ってください。計算では交易品の段階だけで照合するため、アイテム名は確認されません。この寄港地で使う交易品を別途積み込むには、この設定をオフにしてください。",
  "Enter positive whole numbers for both quantities and the exchange count.":
    "渡す数量、受け取る数量、交換回数には、正の整数を入力してください。",
  "Add exchange": "交換を追加",
  "Add an exchange above to start planning your route.":
    "上のフォームから交換を追加すると、航路の計画を始められます。",
  "Move stop up": "寄港地を上に移動",
  "Move stop down": "寄港地を下に移動",
  "Goods to load at the first port:": "最初の港で積み込むアイテム：",
  "Goods remaining after the route:": "航路完了後に残るアイテム：",
  "For linked stops, confirm that the received item is the exact one requested by the next offer.":
    "交換をつなげる場合は、受け取るアイテムが次の交換で指定されたものと完全に一致することを確認してください。",
  "Provisional maximum: 150% of normal capacity ({weight} LT).":
    "暫定上限：通常の最大積載重量の150%（{weight} LT）。",
  "The 150% limit is a temporary planning assumption, not a confirmed game limit. Each exchange must start within normal capacity. Breezy Sail is unavailable while overloaded.":
    "150%の上限は計画用の暫定値で、ゲーム内の上限としては確認されていません。各交換の開始時に、積載重量は通常の上限内に収まっている必要があります。過積載中は快速巡航を使用できません。",
  "The calculator estimates the largest final load from your stock and offer ratios. A game-wide overload limit and whether an offer accepts the final excess are unverified; check in game. Each exchange must start within normal capacity. Breezy Sail is unavailable while overloaded.":
    "在庫と各交換の比率をもとに、最後の交換後の最大積載重量を推定します。ゲーム全体に適用される過積載の上限や、最後の交換で上限を超える積載が認められるかどうかは未確認です。ゲーム内で確認してください。各交換の開始時に、積載重量は通常の上限内に収まっている必要があります。過積載中は快速巡航を使用できません。",
  "Simulate final overload": "最後の交換後の過積載をシミュレート",
  "Your chosen maximum total cargo (LT)": "任意の総積載重量の上限（LT）",
  "Enter a total above your normal ship capacity to activate this simulation.":
    "シミュレーションを有効にするには、船舶の通常の最大積載重量を超える値を入力してください。",
  "The chosen maximum is your planning limit, not a verified game limit. This estimates an overloaded result after the last exchange only; confirm in game that the offer permits it. You cannot begin another barter while overloaded, and Breezy Sail is unavailable.":
    "入力した上限は計画用の値で、ゲーム内で確認された上限ではありません。過積載の見積もりは最後の交換後に限ります。その交換で過積載が認められるかは、ゲーム内で確認してください。過積載中は次の物々交換を開始できず、快速巡航も使用できません。",
  "Final overload estimate": "最後の交換後の過積載見積もり",
  "The ship must be within normal capacity before each exchange.":
    "各交換の前に、船舶の積載重量が通常の上限内に収まっている必要があります。",
  "Over normal capacity:": "通常の上限からの超過分：",
  "The multi-stop route planner checks normal capacity and flags any overload.":
    "複数の寄港地を巡る航路では、通常の最大積載重量を基準に確認し、過積載があれば表示します。",
  "The planner finds how many goods to load to maximize the selected final level.":
    "選択した最終段階の交易品をできるだけ多く入手するために、最初に積み込むべき数量を計算します。",
  "Starting goods available": "開始アイテムの在庫数",
  "Weight of available goods:": "在庫の総重量：",
  "LT; the recommended load is calculated below.": "LT。推奨積載量は下に表示されます。",
  "The selected level cannot be reached with the available stock, capacity and offer limits. This plan reaches level {level}.":
    "現在の在庫、最大積載重量、交換回数の上限では、選択した段階まで到達できません。この計画では{level}段階まで到達します。",
  "Recommended to load on this voyage": "この航海の推奨積載数",
  "Of {available} available, leave {remaining} in storage for another trip.":
    "在庫{available}個のうち、{remaining}個は次の航海のために倉庫に残してください。",
  "Space available throughout the voyage: {weight}.": "航海全体を通じて使える空き容量：{weight}。",
  "For example, you could carry one of these alternatives as extra cargo:":
    "たとえば、次のいずれかを追加貨物として積めます：",
  "These alternatives use the same free space; do not add them together. They are carried unchanged throughout this chain; extra exchanges require a separate calculation and available inventory slots.":
    "どの候補も同じ空き容量を使うので、合算しないでください。連続交換の間、追加貨物は交換せずに積んだままにします。追加の交換には、別途計算とバッグの空きスロットが必要です。",
  "Enter the number of starting goods available.": "開始アイテムの在庫数を入力してください。",
  "Pre-loaded cargo exceeds the ship's capacity.":
    "積載済み貨物が船舶の最大積載重量を超えています。",
  "These custom ratios require too many combinations to calculate safely. Reduce the stock or adjust the ratios.":
    "入力した交換比率では組み合わせが多すぎて、正確に計算できません。在庫数を減らすか、交換比率を調整してください。",
  "No exchange fits within the available stock, cargo capacity and offer limits.":
    "現在の在庫、最大積載重量、交換回数の上限で実行できる交換はありません。",
  "No safe chain could be found.": "積載上限内に収まる連続交換が見つかりませんでした。",
  "The simulation trades as many goods as possible at each level before moving on.":
    "シミュレーションでは、各段階で可能な限り多く交換してから次の段階に進みます。",
  "Bartali Sailboat": "バルタリ帆船",
  "Epheria Cog": "エフェリア高速艇",
  "Epheria Sailboat": "エフェリア軽帆船",
  "Epheria Frigate": "エフェリア護衛艦",
  "Improved Epheria Sailboat": "改良型エフェリア軽帆船",
  "Improved Epheria Frigate": "改良型エフェリア護衛艦",
  "Epheria Caravel": "エフェリア貿易船",
  "Epheria Galleass": "エフェリア駆逐艦",
  "Epheria Carrack: Advance": "エフェリア重帆船：アドバンス",
  "Epheria Carrack: Balance": "エフェリア重帆船：バランス",
  "Epheria Carrack: Volante": "エフェリア重帆船：ボランテ",
  "Epheria Carrack: Valor": "エフェリア重帆船：バロール",
  "LT/ea": "LT/個",
  "Level 1": "1段階",
  "Level 2": "2段階",
  "Level 3": "3段階",
  "Level 4": "4段階",
  "Level 5": "5段階",
  "Level 6": "6段階",
  "Level 7": "7段階",
  "Land Materials (Tier 0)": "陸地材料（0段階）",
  "Tier 0 (Land)": "0段階（陸地）",
  "Level 1 Barter Goods": "1段階交易品",
  "Level 2 Barter Goods": "2段階交易品",
  "Level 3 Barter Goods": "3段階交易品",
  "Level 4 Barter Goods": "4段階交易品",
  "Level 5 Barter Goods": "5段階交易品",
  "Level 6 Extended Trade Goods": "6段階交易品（拡張）",
  "Level 7 Luxury Ocean Goods": "7段階の高級大洋交易品",
  "Crow Coins": "カラスコイン",
  "Ship Upgrade Materials": "船舶の増築材料",
  "Ship Materials": "船舶材料",
  "Land-item weights and barter quantities vary by item and offer; enter the exact values shown in-game.":
    "陸地材料の重量や交換数量は、アイテムや交換条件によって異なります。ゲーム内の正確な値を入力してください。",
  "Entry-level ocean barter goods. Cannot be sold to NPC vendors. Current Level 1 to Level 2 offers return 2 or 3 items per input.":
    "初級の海上交易品です。NPC商店には売却できません。現在、1段階から2段階への交換では、渡した交易品ごとに2個または3個を受け取れます。",
  "Intermediate sea trade goods. Cannot be sold to NPC vendors. Current Level 2 to Level 3 offers return 2 or 3 items per input.":
    "中級の海上交易品です。NPC商店には売却できません。現在、2段階から3段階への交換では、渡した交易品ごとに2個または3個を受け取れます。",
  "Sellable for 1,000,000 Silver or exchanged for Level 4 goods. The typical Level 3 to Level 4 preset is 1:2; the offer is authoritative.":
    "1,000,000シルバーでの売却、または4段階交易品との交換が可能です。3段階から4段階への交換比率は通常1:2が目安です。実際の条件はゲーム内の表示を優先してください。",
  "Sellable for 2,000,000 Silver. Also used for Crow Coin exchanges; the exchange ratio varies by offer.":
    "2,000,000シルバーで売却できます。カラスコインとの交換にも使われ、比率は交換ごとに異なります。",
  "Normal Level 5 goods sell for 10,000,000 Silver; rare Great Ocean Level 5 goods sell for 25,000,000 Silver. Confirm the variant before selling.":
    "通常の5段階交易品は10,000,000シルバー、希少な5段階の大洋交易品は25,000,000シルバーで売却できます。売却前に交易品の種類を確認してください。",
  "Level 6 Great Ocean goods sell to an NPC vendor for 50,000,000 Silver. Exchange ratios are offer-specific.":
    "6段階の大洋交易品はNPC商店に50,000,000シルバーで売却できます。比率は交換ごとに異なります。",
  "Level 7 Great Ocean goods sell to an NPC vendor for 100,000,000 Silver. This is the terminal tier, with no next-tier exchange.":
    "7段階の大洋交易品はNPC商店に100,000,000シルバーで売却できます。これが最終段階で、次の段階への交換はありません。",
  "Crow's Nest currency weighing 0 LT. Coin payouts are offer-specific; enter the exact ratio shown in-game.":
    "カラスの巣で使われる重量0 LTの通貨です。受け取れるコインの枚数は交換ごとに異なります。ゲーム内の正確な比率を入力してください。",
  "Each ship material has its own weight and exchange quantity; enter the exact values shown in-game.":
    "重量と交換数量は船舶材料ごとに異なります。ゲーム内の正確な値を入力してください。",
  Varies: "変動",
  "Offer-specific": "交換ごとに異なる",
  "25M Great Ocean": "25M（大洋）",
  "Tier 3 (Carrack)": "3段階（重帆船）",
  "Tier 2 (Upgraded)": "2段階（増築船）",
  "Tier 1 (Base)": "1段階（基本船）",
  Beginner: "初心者向け",
  "Configure Ship": "船舶を設定",
  "Complete Offer Details": "交換条件を入力",
  "Safe Voyage": "積載上限内",
  "No Stock": "在庫なし",
  "Over Encumbered": "過積載",
  "No Free Capacity": "積載に空きなし",
  "No Safe Trade": "上限内で交換不可",
  "Needs input": "入力が必要",
  "No exchange yet": "交換なし",
  "Safe through Level {level}": "{level}段階まで積載上限内",
  "Enter a valid live max cargo in Vessel Configuration.":
    "船舶設定で、現在の最大積載重量を正しく入力してください。",
  "Pre-loaded cargo must be a non-negative LT value.":
    "積載済み貨物の重量（LT）には、負でない値を入力してください。",
  "Quantity to load must be a whole number of zero or more.":
    "積み込む個数には、0以上の整数を入力してください。",
  "Choose a maximum level higher than the starting level.":
    "開始段階より上の段階を上限に選んでください。",
  "Enter a valid ratio for: {levels}.": "次の段階の交換比率を正しく入力してください：{levels}。",
  "Remaining offer limits must be whole numbers of zero or more.":
    "残り交換回数には、0以上の整数を入力してください。",
  "Unit weight is missing for Level {level}.":
    "{level}段階の交易品の単体重量が入力されていません。",
  "Reached the selected maximum level {level}.": "選択した上限の{level}段階に到達しました。",
  "Load at least one starting good to simulate the chain.":
    "連続交換をシミュレートするには、開始アイテムを最低1個積んでください。",
  "Starting goods and pre-loaded cargo exceed capacity by {weight}.":
    "開始アイテムと積載済み貨物の合計が、最大積載重量を{weight}超えています。",
  "No room for another Level {from} → {to} exchange. One more would weigh {weight} against your {limit} limit.":
    "{from} → {to}段階の交換をさらに行う余裕がありません。あと1回交換すると、上限{limit}に対して積載重量が{weight}になります。",
  "The Level {from} → {to} offer has no remaining exchanges.":
    "{from} → {to}段階の交換に残り回数がありません。",
  "Not enough Level {level} goods for another offer; {count} more required.":
    "次の交換に必要な{level}段階交易品が足りません。あと{count}個必要です。",
  "The entered ratio produces a quantity too large to calculate safely.":
    "入力した交換比率では数量が大きくなりすぎて、正確に計算できません。",
  "Chain simulation stopped.": "連続交換のシミュレーションが停止しました。",
  "{weight} over": "{weight}超過",
  "of {weight} LT total": "上限{weight} LT",
  "Enter the total max cargo shown in your ship's information window.":
    "船舶情報に表示されている最大積載重量の合計を入力してください。",
  "Must be at least the {ship} hull base of {weight} LT.":
    "{ship}の基本積載重量である{weight} LT以上を指定してください。",
  Unknown: "不明",
  "invalid capacity": "積載上限が無効",
  Stop: "か所の寄港地",
  Stops: "か所の寄港地",
  "{count} input units loaded at first port": "最初の港で交換用のアイテムを{count}個積み込み",
  "{weight} LT over at departure": "出港時に{weight} LT超過",
  "{weight} LT over after exchange": "交換後に{weight} LT超過",
  "At least {weight}": "少なくとも{weight}",
  "Adjust offer ratios or remaining limits": "交換比率または残り交換回数を調整",
  Optional: "任意",
  "Each leg starts with its first typical ratio preset. Check the in-game offer and change only the legs that differ. Offer limits are optional and belong to the individual offer.":
    "各区間には、最初の推奨比率が初期値として入ります。ゲーム内の交換条件を確認し、比率が異なる区間だけ変更してください。回数の上限は任意で、交換ごとに設定します。",
  Level: "段階",
  "Input : output ratio": "交換比率（渡す : 受け取る）",
  typical: "目安",
  "Custom ratio": "手動入力した比率",
  "Remaining offer exchanges": "残り交換回数",
  "No limit entered": "上限の入力なし",
  "Input units per exchange": "交換ごとに渡す個数",
  "Output units per exchange": "交換ごとに受け取る個数",
  "Automatic Barter Chain": "物々交換の自動連続計算",
  "Enter the goods you start with. The calculator chains every possible tier and stops when cargo space, stock, or an offer limit prevents the next exchange.":
    "最初に使うアイテムを入力してください。可能な段階まで交換をつなげ、積載の空き、在庫、または交換回数の上限が原因で次の交換ができなくなった時点で止まります。",
  "Starting goods": "開始アイテム",
  "LT each)": "LT/個)",
  "Maximum level": "上限段階",
  "Quantity to load": "積み込む個数",
  units: "個",
  "Starting load weight:": "開始時に積むアイテムの重量：",
  "LT, plus your current ship cargo.": "LT。現在の積載重量に加算されます。",
  "Furthest tier reached": "到達した最終段階",
  "Goods at furthest tier": "最終段階の交易品数",
  "Exchanges completed": "完了した交換回数",
  "Departure with starting goods:": "開始アイテムを積んだ出港時の重量：",
  "Peak cargo during chain:": "連続交換中の最大積載重量：",
  "Free at peak:": "積載重量が最大のときの空き：",
  "Final cargo after the last exchange:": "最後の交換後の積載重量：",
  "Chain breakdown": "連続交換の内訳",
  "in →": "個渡す →",
  out: "個受け取る",
  "× Level": "× 段階",
  remain: "が残ります",
  "free after exchange": "交換後の空き",
  "This offer's remaining limit was reached. ": "この交換の残り回数を使い切りました。",
  "Cargo capacity limited the batch.": "積載上限により、一度に交換できる回数が制限されました。",
  "Starting goods include": "最初に積むのは",
  ", added on top of your pre-loaded cargo. Any leftover goods stay aboard and count toward the next weight check.":
    "です。積載済み貨物に追加します。余ったアイテムは船に残り、次の重量チェックにも含まれます。",
  "Final inventory:": "最終在庫：",
  "Automatic chain result": "自動連続交換の結果",
  "Typical ratios are applied automatically. Confirm each offer in game; open the optional settings above only when a ratio or remaining offer limit differs.":
    "推奨比率が自動で適用されます。各交換の条件をゲーム内で確認し、比率や残り交換回数の上限が異なる場合のみ、上の任意設定を開いてください。",
  "Trade Optimization Result": "物々交換の最適化結果",
  "Enter a valid actual max cargo in Vessel Configuration. The value must be at least the ship's hull base.":
    "船舶設定で、現在の最大積載重量を正しく入力してください。船舶の基本積載重量以上の値が必要です。",
  "Enter the exact unit weight for each variable-weight item.":
    "重量が一律でないアイテムは、それぞれの正確な単体重量を入力してください。",
  "Enter the input and output quantities shown for this barter offer.":
    "この物々交換で表示される、渡す数量と受け取る数量を入力してください。",
  "Enter the remaining exchange cap shown for this specific offer.":
    "この交換に表示されている残り交換回数の上限を入力してください。",
  "Pre-loaded cargo already exceeds the ship's max capacity before any trade goods are added.":
    "交易品を積む前に、積載済み貨物だけで船舶の最大積載重量を超えています。",
  "Recommended to Load on Ship": "船舶への推奨積載数",
  "exchanges @": "回、",
  "ratio)": "の比率)",
  "You Receive (Output)": "受け取るアイテム",
  "Net Weight Change": "重量の増減",
  "Departure (pre-loaded + input goods):": "出港時（積載済み貨物＋渡すアイテム）：",
  "Arrival (pre-loaded + received goods):": "到着時（積載済み貨物＋受け取るアイテム）：",
  "Arrival cargo buffer:": "到着時の積載の空き：",
  "LT over": "LT超過",
  "LT free": "LTの空き",
  "Pre-loaded cargo excludes the goods being exchanged. Input goods are counted as loaded before departure.":
    "積載済み貨物に交換対象のアイテムは含めません。渡すアイテムは出港前に積み込むものとして計算します。",
  "Limited by your stock of": "所持数による制限：",
  "Limited by this offer's remaining exchange cap of": "この交換の残り回数による制限：",
  "trades.": "回。",
  "Limited by the weight of received": "最大積載重量により制限されます。受け取る交易品：",
  "LT each) to prevent exceeding your ship's max LT.": "LT/個)。",
  "Limited by the input goods loaded on top of pre-loaded cargo when leaving port.":
    "出港時に積載済み貨物に追加する、交換用アイテムの重量によって制限されます。",
  "No free cargo capacity remains for input goods.": "渡すアイテムを積める空き容量がありません。",
  "You do not own enough": "在庫不足：",
  "for even one exchange at this ratio.": "が足りず、この比率では一度も交換できません。",
  "Even one exchange would exceed the ship's max capacity. Reduce pre-loaded cargo or choose lighter goods.":
    "一度交換するだけでも船舶の最大積載重量を超えます。積載済み貨物を減らすか、より軽いアイテムを選んでください。",
  "Add Trade to Route Planner": "航路計画に交換を追加",
  "Barter Trade Parameters": "物々交換の条件",
  "Enter the exact goods, ratio, and exchange cap shown in the barter offer. The offer always overrides the presets below.":
    "物々交換に表示されている正確なアイテム、比率、交換回数の上限を入力してください。下の初期設定よりも、実際の交換条件が常に優先されます。",
  "Source Material (Input)": "渡すアイテム",
  "Enter exact LT/ea": "正確なLT/個を入力",
  "variable LT": "重量可変（LT）",
  "Received Material (Output)": "受け取るアイテム",
  "Exact input item weight (LT each)": "渡すアイテムの正確な単体重量（LT/個）",
  "Read the exact item's LT": "アイテムの正確なLTを確認",
  "Exact output item weight (LT each)": "受け取るアイテムの正確な単体重量（LT/個）",
  "Land goods and ship materials do not share one weight. Use the exact item selected at the barter node.":
    "陸地材料と船舶材料はアイテムごとに重量が異なります。物々交換先で選んだアイテムの正確な重量を入力してください。",
  "Quantity Owned in Storage / Inventory": "倉庫・バッグの所持数",
  "Total Weight:": "合計重量：",
  "enter the exact unit weight": "正確な単体重量を入力",
  "e.g. 10": "例：10",
  "Exchange Ratio (Input : Output)": "交換比率（渡す : 受け取る）",
  "Choose the offer ratio or enter a custom one": "交換比率を選択するか、手動で入力",
  "Enter the exact ratio shown in the barter offer": "物々交換に表示されている正確な比率を入力",
  Custom: "手動入力",
  "Input Qty": "渡す数量",
  "Output Qty": "受け取る数量",
  "Input goods are loaded on top of pre-loaded cargo. After the exchange, received goods replace their weight. Ratios are presets only; the exact offer can differ.":
    "渡すアイテムは積載済み貨物に追加します。交換後は、受け取ったアイテムの重量に置き換わります。比率はプリセットなので、実際の交換条件と異なる場合があります。",
  "Cap by this offer's remaining exchange limit": "この交換の残り回数を上限にする",
  "Offer-specific exchange limit": "この交換の回数上限",
  "remaining trades": "回（残り）",
  "Optional. The cap belongs to the individual barter offer, not to the island node. Leave this off when the offer shows no remaining limit.":
    "任意。上限は島の拠点単位ではなく、個別の交換ごとに設定されます。残り回数の上限が表示されていない場合は、オフのままにしてください。",
  "Enter the remaining exchange count shown for this specific offer.":
    "この交換に表示されている残り交換回数を入力してください。",
  "BDO Barter Calculator": "黒い砂漠 物々交換計算機",
  "Satella Mode": "サテラモード",
  "Black Desert Online • Ship Cargo & Trade Optimizer": "黒い砂漠 • 船舶の積載・物々交換の最適化",
  "Toggle theme": "テーマを切り替え",
  "Satella Dark": "サテラダーク",
  "Light Mode": "ライトモード",
  "BDO Barter Goods Reference": "黒い砂漠 物々交換品一覧",
  "Official base weights and NPC sale prices; ratios and exchange caps are offer-specific.":
    "重量とNPCへの売却価格は公式の基本値です。比率や交換回数の上限は交換ごとに異なります。",
  "Tier / Good": "段階 / アイテム",
  "Unit Weight": "単体重量",
  "Typical Next-Tier Ratios": "次の段階への標準交換比率",
  "NPC Sale Price": "NPCへの売却価格",
  "Description & Purpose": "説明・用途",
  "Captain's Ocean Trade Rules:": "船長の海上交易ガイド：",
  "Data version:": "データの版：",
  "Official Pearl Abyss base values from the April 16, 2026 barter update, audited November 15, 2026. Unit weights and NPC prices are fixed per good.":
    "Pearl Abyssによる2026年4月16日の物々交換アップデート時点の公式基本値です。2026年11月15日に検証しました。単体重量とNPCへの売却価格はアイテムごとに固定です。",
  "Ratios are presets:": "比率は目安：",
  "Level 1 to Level 2 and Level 2 to Level 3 offers currently return 2 or 3 outputs per input. Other next-tier ratios shown are typical values, not universal rules. The in-game offer always wins.":
    "現在、1段階から2段階、および2段階から3段階への交換では、渡した交易品ごとに2個または3個を受け取れます。ほかの段階への比率も目安で、すべての交換に共通するわけではありません。ゲーム内の条件を常に優先してください。",
  "Level 5 price:": "5段階の売却価格：",
  "Normal goods sell for 10M Silver; rare Great Ocean variants sell for 25M. Confirm the item variant before selling.":
    "通常の交易品は10Mシルバー、希少な大洋交易品は25Mシルバーで売却できます。売却前に交易品の種類を確認してください。",
  "Great Ocean:": "大洋：",
  "BDO's open-sea sailing area and barter routes. The":
    "黒い砂漠の外洋の航行エリアと、そこにある交易路です。",
  "label marks specific rare Level 5 goods, not every Level 5 item or a separate tier. Board an ocean-going ship through a Wharf Manager and sail to the island shown by an offer listing one of those goods. Check the in-game offer for the route and exact item before setting out.":
    "の表記は、一部の希少な5段階交易品に付きます。すべての5段階交易品に付くわけではなく、別の段階を示すものでもありません。船着場管理人を通じて外洋を航行できる船舶に乗り、対象の交易品を扱う交換に表示された島へ向かってください。出港前にゲーム内の交換情報で交易路と対象アイテムを確認してください。",
  "Exchange caps:": "交換回数の上限：",
  "A remaining cap belongs to the individual barter offer, not to the island node. Enter the count shown for that offer.":
    "残り交換回数の上限は島の拠点単位ではなく、個別の交換ごとに設定されます。その交換に表示された回数を入力してください。",
  "Variable items:": "値が変わるアイテム：",
  "Land goods and ship materials have item-specific weights; Crow Coin amounts and ratios vary by offer. Enter the values shown in-game.":
    "陸地材料と船舶材料はアイテムごとに重量が異なり、カラスコインの枚数と交換比率は交換ごとに異なります。ゲーム内に表示されている値を入力してください。",
  "Ship capacity:": "船舶の最大積載重量：",
  "Enter the live max LT from Ship Info after equipping gear, sailors, and buffs. The hull base is shown for reference only; do not add it again.":
    "装備を付け、船員を配置し、バフを適用した状態で、船舶情報に表示される最大積載重量（LT）を入力してください。船舶の基本積載重量は参考値です。再度加算しないでください。",
  "Vessel Configuration": "船舶設定",
  "Select your vessel and enter the live maximum cargo shown in its in-game information window.":
    "船舶を選択し、ゲーム内の船舶情報に表示されている現在の最大積載重量を入力してください。",
  "Available Cargo": "積載の空き",
  "configure ship capacity": "船舶の最大積載重量を設定",
  "Official BDO Vessel": "黒い砂漠の公式船舶",
  "Cannons:": "艦砲：",
  "Cabins:": "船室：",
  "Actual Max Cargo (from Ship Info)": "現在の最大積載重量（船舶情報）",
  "Reset to Hull Base": "基本積載重量に戻す",
  "Enter live total": "現在の合計値を入力",
  "Hull base (reference only)": "船舶の基本積載重量（参考値）",
  "Configured gear/sailor bonus": "設定上の装備・船員の補正",
  "Enter the total LT shown in Ship Info. It already includes gear, sailors, and buffs; do not add the hull base again.":
    "船舶情報に表示される合計重量（LT）を入力してください。この値には装備、船員、バフがすでに反映されています。船舶の基本積載重量を再度加算しないでください。",
  "Pre-loaded Cargo (LT)": "積載済み貨物（LT）",
  "0 (Empty)": "0（空）",
  "Existing cargo, sailor food, or supplies. Do not include the goods you will exchange at the barter node.":
    "すでに積んでいる貨物、船員の食料、補給品などが対象です。物々交換先で渡すアイテムは含めないでください。",
  "Hull base and configured bonus are shown separately so the live total is never counted twice.":
    "現在の合計値を二重計上しないよう、船舶の基本積載重量と設定した補正値を別々に表示しています。",
  "Multi-Stop Voyage Planner": "複数寄港地の航路計画",
  "Chained route simulation. Inputs not produced by an earlier stop are loaded at the first port, because barter islands have no storage.":
    "複数の交換をつないで航路をシミュレートします。物々交換を行う島には倉庫がないため、前の寄港地で入手しないアイテムは最初の港で積み込みます。",
  "Clear Route": "航路を消去",
  Give: "渡す",
  Get: "受け取る",
  ratio: "の比率",
  "All inputs reused from earlier stops": "渡すアイテムはすべて前の寄港地で入手したものを使用",
  "Departure → Arrival": "出港 → 到着",
  "Limit:": "上限：",
  "Remove stop": "寄港地を削除",
  "Inputs loaded at first port:": "最初の港で積み込む交換用アイテム：",
  "Departure from port:": "港を出発する時点の積載重量：",
  "Final voyage cargo:": "航路完了時の積載重量：",
  "Set a valid actual max cargo in Vessel Configuration to verify this route.":
    "航路を確認するには、船舶設定で現在の最大積載重量を正しく入力してください。",
  "Cannot fully verify the route: one or more stops are missing exact item weights.":
    "正確なアイテム重量が未入力の寄港地があるため、航路全体を確認できません。",
  "Warning: the vessel exceeds max capacity when leaving the first port.":
    "警告：最初の港を出発する時点で、船舶の最大積載重量を超えています。",
  "Warning: the vessel exceeds max capacity during this route. Check the highlighted stop.":
    "警告：この航路の途中で船舶の最大積載重量を超えます。強調表示された寄港地を確認してください。",
  "Complete route fits within the ship's weight limit.":
    "すべての寄港地を含む航路が船舶の重量上限内に収まります。",
  "Black Desert Online Barter Trade & Weight Calculator": "黒い砂漠 物々交換・積載重量計算機",
  "Crafted with": "心を込めて制作",
  in: "テーマ：",
};
