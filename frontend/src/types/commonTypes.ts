export type PollId = number;
export type PollName = string;
export type OptionName = string;
export type PollDescription = string;
export type UnixTimestamp = number;
export type VoteCount = number;

export interface Option {
  optionName: OptionName;
  voteCount: VoteCount;
}

export interface PollList {
  [index: PollId]: PollName;
}

export interface PollElement {
  name: PollName;
  description: PollDescription;
  createdTime: UnixTimestamp;
  endTime: UnixTimestamp;
  totalVoteCount: VoteCount;
  options: Option[];
}