import ChatSidebar from "./ChatSideBar"

export default async function FriendsList() {
    const friends = Array.from({ length: 20 }, (_, i) => `Friend ${i + 1}`);
    const suggested = Array.from({ length: 20 }, (_, i) => `Suggested ${i + 1}`);
    // return <><ChatSidebar friends={friends} suggested={suggested}/></>
    return <><ChatSidebar /></>
}