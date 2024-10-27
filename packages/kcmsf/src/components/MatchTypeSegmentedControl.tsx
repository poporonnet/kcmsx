import { config, MatchType } from "config";
import { LabeledSegmentedControl } from "./LabeledSegmentedControl";

export const MatchSegmentedControl = ({
  matchType,
  setMatchType,
}: {
  matchType: MatchType;
  setMatchType: (matchType: MatchType) => void;
}) => (
  <LabeledSegmentedControl
    label="試合の種別:"
    data={config.matches.map(({ type, name }) => ({
      label: name,
      value: type,
    }))}
    value={matchType}
    onChange={(value) => setMatchType(value as MatchType)}
  />
);
