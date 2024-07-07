import { Dispatch, ReactNode, SetStateAction } from "react";

interface AnnouncementProps {
    children: ReactNode;
    colour?: string;
    setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default AnnouncementProps;