export type PollId = number;
export type PollName = string;
export type OptionName = string;
export type PollDescription = string;
export type UnixTimestamp = number;
export type VoteCount = number;

/** Contract result objects */
export type PollViewResult = [[], []];
export type ListAllResult = [PollId, PollName][];
export type ListActiveResult = [PollId, PollName][];

export interface Option {
  optionName: OptionName;
  voteCount: VoteCount;
}

export interface PollList {
  [index: PollId]: PollName;
}

export interface PollElement {
  id: PollId;
  name: PollName;
  description: PollDescription;
  createdTime: UnixTimestamp;
  endTime: UnixTimestamp;
  totalVoteCount: VoteCount;
  options: Option[];
}

export interface PollInitObject {
  name: PollName;
  desc: PollDescription;
  end: UnixTimestamp;
  options: OptionName[];
}
