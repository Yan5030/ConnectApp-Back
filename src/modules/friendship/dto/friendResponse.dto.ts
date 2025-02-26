export class FriendResponseDto {
    id: string;
    name: string;
    profilePicture: string;
  
    constructor(id: string, name: string, profilePicture: string) {
      this.id = id;
      this.name = name;
      this.profilePicture = profilePicture;
    }
  }
  