export interface IUserLoginProps {
    email: string,
    password: string
}

export interface IUser {
    _id: string,
    name: string,
    dOB: Date,
    email: string,

}

export interface IData {
    user: IUser | any,
    access_token: string,
    refresh_token: string,
    error?: any
}

export interface IUserRegisterProps {
    name: string,
    email: string,
    phone: number,
    password: string
}

export interface CustomButtonProps {
    type?: string,
    title: any,
    backgroundColor: string,
    color: string,
    fullWidth?: boolean,
    icon?: ReactNode,
    disabled?: boolean,
    handleClick?: () => void,

    width?: string | any
}

export interface ProfileProps {
    _id: any,
    name: string,
    avatar: string,
    email: string,
    allInstitutions: Array | undefined,
    isActivated: boolean,
    dOB: Date | any,
    phone: number,
    phoneVerify: boolean,
    isAdmin: boolean,
    favoritePlaces: Array | undefined,
    myReviews: Array | undefined,
    createdAt?: Date | any
}

export interface PropertyProps {
    _id: string,
    title: string,
    description: string,
    otherPhoto: Array | undefined,
    city: string,
    type: string,
    mainPhoto: string,
    workSchedule: {
        workDays: {
            days: {
                from: string,
                to: string
            },
            time: {
                from: Date | string,
                to: Date | string,
            }
        },
        weekend: string,
    },
    location: {
        lng: number | any,
        lat: number | any
    },
    contacts: Array<string>,
    tags: Array<string>,
    verify: boolean,
    rating: number,
    averageCheck: string,
    features: Array<string>,
    createdBy?: string,
    news?: Array | undefined,
    createdAt?: Date | any
}

export interface City {
    name: string;
    region: string;
}
export interface InstitutionNewsProps {
    _id: string,
    institutionId: string,
    photo: Array<string>,
    video?: string,
    desc: string,
    createdAt?: Date | any
}

export interface FormProps {
    type: string,
    register: any,
    onFinish: (values: FieldValues) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>,
    formLoading: boolean,
    handleSubmit: FormEventHandler<HTMLFormElement> | undefined,
    handleImageChange: (file) => void,
    onFinishHandler: (data: FieldValues) => Promise<void> | void,
    propertyImage: { name: string, url: string },
}


export interface IConv {
    _id?: string,
    members?: string[],
    createdAt?: string
}

export interface IMessage {
    _id?: string,
    conversationId?: string,
    sender?: string,
    text?: string,
    createdAt?: string
}

export interface IChat {
    members?: string[],

    _id?: string,

    message?: string
}