import {Button, Typography} from "@mui/material";

import {CustomButtonProps} from "interfaces/common";

const CustomButton = ({
                          type,
                          title,
                          backgroundColor,
                          color,
                          fullWidth,
                          icon,
                          handleClick,
                          disabled,
                          width
                      }: CustomButtonProps) => {
    return (
        <Button
            disabled={disabled}
            type={type === "submit" ? "submit" : "button"}
            sx={{
                flex: fullWidth ? 1 : "unset",
                padding: {xs: '5px 10px', sm: "10px 15px"},
                width: fullWidth ? "100%" : width,
                minWidth: width ?? 130,
                backgroundColor,
                color,
                fontSize: {xs: '12px', sm: '14px'},
                fontWeight: 600,
                gap: "10px",
                textTransform: "capitalize",
                transition: '300ms linear',
                "&:hover": {
                    opacity: 0.9,
                    backgroundColor: '#974063',
                },
            }}
            onClick={handleClick}
        >
            {icon}
            <Typography component={"span"} sx={{
                fontSize: {xs: '14px', sm: '16px'}
            }}>
                {title}
            </Typography>
        </Button>
    );
};

export default CustomButton;

