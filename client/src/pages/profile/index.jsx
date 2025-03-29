import { useAppStore } from "../../store";

const profile = () => {
    const {userInfo}= useAppStore()

    return (
        <div>
            <h1>Profile</h1>
            {/* <h2>{userInfo?.name}</h2> */}
            {/* <h2>{userInfo.email}</h2> */}
        </div>
    )
}
export default profile;