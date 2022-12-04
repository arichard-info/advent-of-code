declare const inquirer: any;
declare const getYear: (years: string[]) => Promise<string>;
declare const getDay: (existingDays: string[]) => Promise<string>;
declare enum Action {
    EXAMPLE = "example",
    DATA = "data",
    EXIT = "exit",
    BACK = "back"
}
declare const getAction: (defaultAction?: Action) => Promise<Action>;
