import { BookOpen, Coins, HelpCircle } from "lucide-react";
import { BARTER_TIERS, ORDERED_TIER_KEYS } from "../data/barterTiers";

export function QuickReference() {
  return (
    <div className="rounded-2xl p-5 sm:p-6 transition-colors duration-300 border bg-white border-slate-200/80 shadow-sm dark:bg-satella-card dark:border-satella-border/80 dark:shadow-satella-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-satella-border/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-satella-surface dark:text-satella-primary">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-satella-silver-glow flex items-center gap-2">
              BDO Barter Goods Reference
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official base weights and NPC sale prices; ratios and exchange caps are
              offer-specific.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-satella-border text-slate-400 dark:text-slate-500 uppercase tracking-wider text-xs">
              <th className="py-2.5 px-3">Tier / Good</th>
              <th className="py-2.5 px-3 text-right">Unit Weight</th>
              <th className="py-2.5 px-3 text-center">Typical Next-Tier Ratios</th>
              <th className="py-2.5 px-3 text-right">NPC Sale Price</th>
              <th className="py-2.5 px-3">Description & Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-satella-border/40">
            {ORDERED_TIER_KEYS.map((tierKey) => {
              const tier = BARTER_TIERS[tierKey];

              return (
                <tr
                  key={tier.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-satella-surface/50 transition-colors"
                >
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-satella-silver flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tierKey === 1
                          ? "bg-emerald-400"
                          : tierKey === 2
                            ? "bg-blue-400"
                            : tierKey === 3
                              ? "bg-amber-400"
                              : tierKey === 4
                                ? "bg-purple-400"
                                : tierKey === 5
                                  ? "bg-rose-400"
                                  : "bg-indigo-400"
                      }`}
                    />
                    <span>{tier.name}</span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-purple-700 dark:text-satella-glow">
                    {tier.unitWeight === null ? "Varies" : `${tier.unitWeight} LT`}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {tier.typicalRatios.length > 0 ? (
                        tier.typicalRatios.map((r) => (
                          <span
                            key={`${r.input}-${r.output}`}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-satella-surface text-slate-700 dark:text-purple-300 font-mono text-xs border border-slate-200 dark:border-satella-border"
                          >
                            {r.input}:{r.output}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">
                          {tierKey === 7 ? "—" : "Offer-specific"}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-satella-silver">
                    {tier.silverValues?.length > 0 ? (
                      <span className="flex items-center justify-end gap-1 text-amber-600 dark:text-amber-400">
                        <Coins className="w-3 h-3 inline" />
                        {tier.silverLabels
                          ? tier.silverLabels.join(" / ")
                          : tier.silverValues
                              .map((value) => `${(value / 1_000_000).toLocaleString()}M`)
                              .join(" / ")}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-xs max-w-xs">
                    {tier.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Helpful Bartering Tips Box */}
      <div className="mt-5 p-4 rounded-xl bg-purple-50/60 dark:bg-satella-surface/60 border border-purple-200/60 dark:border-satella-border text-xs space-y-1.5">
        <div className="font-bold text-purple-900 dark:text-satella-silver-glow flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-purple-600 dark:text-satella-primary" />
          Captain's Ocean Trade Rules:
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-purple-300/80 pl-1 text-xs">
          <li>
            <strong>Data version:</strong> Official Pearl Abyss base values from the April 16, 2026
            barter update, audited November 15, 2026. Unit weights and NPC prices are fixed per
            good.
          </li>
          <li>
            <strong>Ratios are presets:</strong> Level 1 to Level 2 and Level 2 to Level 3 offers
            currently return 2 or 3 outputs per input. Other next-tier ratios shown are typical
            values, not universal rules. The in-game offer always wins.
          </li>
          <li>
            <strong>Level 5 price:</strong> Normal goods sell for 10M Silver; rare Great Ocean
            variants sell for 25M. Confirm the item variant before selling.
          </li>
          <li>
            <strong>Great Ocean:</strong> BDO's open-sea sailing area and barter routes. The
            <code> [Great Ocean] </code> label marks specific rare Level 5 goods, not every Level 5
            item or a separate tier. Board an ocean-going ship through a Wharf Manager and sail to
            the island shown by an offer listing one of those goods. Check the in-game offer for the
            route and exact item before setting out.
          </li>
          <li>
            <strong>Exchange caps:</strong> A remaining cap belongs to the individual barter offer,
            not to the island node. Enter the count shown for that offer.
          </li>
          <li>
            <strong>Variable items:</strong> Land goods and ship materials have item-specific
            weights; Crow Coin amounts and ratios vary by offer. Enter the values shown in-game.
          </li>
          <li>
            <strong>Ship capacity:</strong> Enter the live max LT from Ship Info after equipping
            gear, sailors, and buffs. The hull base is shown for reference only; do not add it
            again.
          </li>
        </ul>
      </div>
    </div>
  );
}
