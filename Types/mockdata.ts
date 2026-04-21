export interface Groupdata {
  groupName: string;
  amount: number;
  nextContribution: string;
}

export const mockGroupdata: Groupdata = {
  groupName: "Family Savings Group",
  amount: 1000000.0,
  nextContribution: "3 May 2026",
};
