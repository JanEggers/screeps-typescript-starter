export interface IRole{
    run(creep: Creep): void;

    roleName: string;

    body:  string[];
    grow:  string[];

    max: number;
}

export interface IRoleLookup {
    [name: string]: IRole;
}
