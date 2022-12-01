declare const inquirer: any;
declare const getYear: (years: string[]) => Promise<string>;
declare const getDay: (days: string[]) => Promise<string>;
declare enum Action {
    EXAMPLE = "example",
    DATA = "data",
    EXIT = "exit"
}
declare const getAction: (defaultAction?: Action) => Promise<Action>;
