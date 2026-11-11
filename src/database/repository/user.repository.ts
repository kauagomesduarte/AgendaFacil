import { error } from "node:console";

export type User = {
    id: Readonly<number>;
    name: string;
}

export let nextId: number = 1;

const userDB: User[] = [];

export function createUser(user: User): void{
    userDB.push(user);
    nextId++;
}

export function findById(userId: number): User | undefined {
    const user: User | undefined = userDB.find(u => u.id === userId);
    return user;
}

export function updateUserById(userId: number, newData: Partial<User>): void{
    const userIndex = userDB.findIndex(u => u.id === userId);
    const user = userDB[userIndex];
    
    if (user === undefined){return}

    userDB[userIndex] = {
        ...user,
        ...newData
    }
}

export function deleteUserById(userId: number): boolean{
    const userIndex = userDB.findIndex(user => user.id == userId);
    if(userIndex === -1) return false;

    userDB.splice(userIndex, 1);
    return true;
}

export function getUsers(): User[]{
    return userDB;
}
