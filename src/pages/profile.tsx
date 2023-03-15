import {useGetIdentity, useOne} from "@refinedev/core";
import {CustomProfile} from "../components";
import {ProfileProps} from "../interfaces/common";

const Profile = () => {
    const { data: user } = useGetIdentity<ProfileProps>();

    const { data, isLoading, isError } = useOne({
        resource: "users",
        id: user?._id,
    });

    const myProfile: ProfileProps | any = data?.data ?? [];

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    return (
        <CustomProfile
            dOB={myProfile?.dOB}
            _id={myProfile?._id}
            phone={myProfile?.phone}
            name={myProfile.name}
            email={myProfile.email}
            avatar={myProfile.avatar}
            allInstitutions={myProfile.allInstitutions}
            isActivated={myProfile.isActivated}
            isAdmin={myProfile.isAdmin}
            phoneVerify={myProfile.phoneVerify}
            favoritePlaces={myProfile.favoritePlaces}
            myReviews={myProfile.myReviews}
        />
    );
};

export default Profile;