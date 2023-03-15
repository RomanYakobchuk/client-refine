import React from "react";
import {useRouterContext, TitleProps} from "@refinedev/core";
import {Box, Button, Typography} from "@mui/material";

export const Title: React.FC<TitleProps> = ({collapsed}) => {
    const {Link} = useRouterContext();

    return (
        <Button fullWidth variant="text" disableRipple>
            <Link to="/">
                {collapsed ? (
                    <img src="/images/logo.png" alt="Refine" width="28px"/>
                ) : (
                    <Box width="140px" sx={{
                        display: 'flex',
                        justifyContent: "center",
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <img src="/images/logo.png" alt="Refine" width={"28px"}/>
                        <Typography sx={{
                            fontSize: '40px',
                            fontWeight: 700,
                            textTransform: "none",
                            textDecoration: "none"
                        }}>
                            Capl
                        </Typography>
                    </Box>
                )}
            </Link>
        </Button>
    );
};
