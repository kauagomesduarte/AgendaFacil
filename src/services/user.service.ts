import * as userRepository from "../database/repository/user.repository.js";


export function createUser(data: Partial<userRepository.User>): void{
    if(!data.name){throw new Error("Invalid data.");}
    const user: userRepository.User = {
        name: data.name,
        id: userRepository.nextId
    };

    userRepository.createUser(user);
}

export function findById(userId: number): userRepository.User{
    const user = userRepository.findById(userId);
    if(!user){throw new Error("Invalid User.");}
    return user;
}

export function updateUserById(userId: number, newData: Partial<userRepository.User>): void{
    if(!userRepository.findById(userId)){throw new Error("Invalid User.");}
    userRepository.updateUserById(userId, newData);
}

export function deleteUserById(userId: number): void{
    if (!userRepository.deleteUserById(userId)) {throw new Error("Invalid user");}
}

export function getUsers(): userRepository.User[]{
    return userRepository.getUsers();
}