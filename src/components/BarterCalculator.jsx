import { useMemo, useState } from "react";
import { BARTER_TIERS } from "../data/barterTiers";
import { calculateTrade } from "../utils/calculator";
import { BarterResultCard } from "./BarterResultCard";
import { BarterTradeForm } from "./BarterTradeForm";

const NEXT_TIER_KEY = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 };

export function BarterCalculator({
  debugEnabled = false,
  shipMaxWeight,
  finalCargoLimit,
  currentShipWeight,
  shipCapacityValid,
  onAddStopToRoute,
}) {
  const [inputTierKey, setInputTierKey] = useState(1);
  const [outputTierKey, setOutputTierKey] = useState(2);
  const [ownedQuantity, setOwnedQuantity] = useState(10);
  const [ratioInput, setRatioInput] = useState(1);
  const [ratioOutput, setRatioOutput] = useState(2);
  const [isCustomRatio, setIsCustomRatio] = useState(false);
  const [applyOfferLimit, setApplyOfferLimit] = useState(false);
  const [offerLimit, setOfferLimit] = useState(null);
  const [customInputUnitWeight, setCustomInputUnitWeight] = useState(null);
  const [customOutputUnitWeight, setCustomOutputUnitWeight] = useState(null);

  const inputTier = BARTER_TIERS[inputTierKey];
  const outputTier = BARTER_TIERS[outputTierKey];
  const inputUnitWeight = inputTierKey === 0 ? 0 : (inputTier.unitWeight ?? customInputUnitWeight);
  const outputUnitWeight = outputTier.unitWeight ?? customOutputUnitWeight;
  const resolvedInputTier = useMemo(
    () => ({ ...inputTier, unitWeight: inputUnitWeight }),
    [inputTier, inputUnitWeight],
  );
  const resolvedOutputTier = useMemo(
    () => ({ ...outputTier, unitWeight: outputUnitWeight }),
    [outputTier, outputUnitWeight],
  );
  const nextTierKey = NEXT_TIER_KEY[inputTierKey];
  const typicalRatios = nextTierKey === outputTierKey ? inputTier.typicalRatios : [];

  const handleInputTierChange = (newTierKey) => {
    setInputTierKey(newTierKey);
    setCustomInputUnitWeight(null);

    const nextTier = NEXT_TIER_KEY[newTierKey];
    if (nextTier !== undefined) {
      setOutputTierKey(nextTier);
      setCustomOutputUnitWeight(null);
    }

    const ratios = nextTier === undefined ? [] : BARTER_TIERS[newTierKey].typicalRatios;
    setRatioInput(ratios[0]?.input ?? null);
    setRatioOutput(ratios[0]?.output ?? null);
    setIsCustomRatio(ratios.length === 0);
  };

  const handleOutputTierChange = (newTierKey) => {
    setOutputTierKey(newTierKey);
    setCustomOutputUnitWeight(null);

    const ratios = NEXT_TIER_KEY[inputTierKey] === newTierKey ? inputTier.typicalRatios : [];
    setRatioInput(ratios[0]?.input ?? null);
    setRatioOutput(ratios[0]?.output ?? null);
    setIsCustomRatio(ratios.length === 0);
  };

  const result = useMemo(() => {
    return calculateTrade({
      shipMaxWeight,
      finalCargoLimit,
      currentShipWeight,
      inputTier: resolvedInputTier,
      outputTier: resolvedOutputTier,
      ownedQuantity,
      ratioInput,
      ratioOutput,
      offerMaxTrades: applyOfferLimit ? (offerLimit ?? 0) : null,
      shipCapacityValid,
    });
  }, [
    shipMaxWeight,
    finalCargoLimit,
    currentShipWeight,
    shipCapacityValid,
    resolvedInputTier,
    resolvedOutputTier,
    ownedQuantity,
    ratioInput,
    ratioOutput,
    applyOfferLimit,
    offerLimit,
  ]);

  const handleQuickRatioSelect = (inVal, outVal) => {
    setRatioInput(inVal);
    setRatioOutput(outVal);
    setIsCustomRatio(false);
  };

  const handleCustomRatioChange = (inVal, outVal) => {
    setRatioInput(inVal);
    setRatioOutput(outVal);
  };

  const handleAddToTrip = () => {
    if (!onAddStopToRoute || result.maxSafeTrades <= 0 || result.needsShipCapacity) return;

    onAddStopToRoute({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${inputTier.shortName} → ${outputTier.shortName}`,
      inputTierLevel: inputTierKey,
      outputTierLevel: outputTierKey,
      tradeCount: result.maxSafeTrades,
      ratioInput,
      ratioOutput,
      inputUnitWeight,
      outputUnitWeight,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <BarterTradeForm
        debugEnabled={debugEnabled}
        inputTierKey={inputTierKey}
        onInputTierChange={handleInputTierChange}
        outputTierKey={outputTierKey}
        onOutputTierChange={handleOutputTierChange}
        inputUnitWeight={inputUnitWeight}
        onInputUnitWeightChange={setCustomInputUnitWeight}
        outputUnitWeight={outputUnitWeight}
        onOutputUnitWeightChange={setCustomOutputUnitWeight}
        ownedQuantity={ownedQuantity}
        onOwnedQuantityChange={setOwnedQuantity}
        ratioInput={ratioInput}
        ratioOutput={ratioOutput}
        onQuickRatioSelect={handleQuickRatioSelect}
        isCustomRatio={isCustomRatio}
        onEnableCustomRatio={() => setIsCustomRatio(true)}
        onCustomRatioChange={handleCustomRatioChange}
        typicalRatios={typicalRatios}
        applyOfferLimit={applyOfferLimit}
        onApplyOfferLimitChange={setApplyOfferLimit}
        offerLimit={offerLimit}
        onOfferLimitChange={setOfferLimit}
      />

      <BarterResultCard
        result={result}
        inputTier={resolvedInputTier}
        outputTier={resolvedOutputTier}
        ratioInput={ratioInput}
        ratioOutput={ratioOutput}
        shipMaxWeight={shipMaxWeight}
        ownedQuantity={ownedQuantity}
        offerLimit={offerLimit}
        onAddToTrip={onAddStopToRoute ? handleAddToTrip : undefined}
      />
    </div>
  );
}
