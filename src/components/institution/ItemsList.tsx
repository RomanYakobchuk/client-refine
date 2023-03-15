import React, {useState} from "react";
import {Button, Chip, Grid, TextField} from "@mui/material";
import {Add} from "@mui/icons-material";

type Number = {
    value: string | any;
};

type Props = {
    onSubmit: (number: string | any) => void;
    elements: string[] | any;
    onDelete: (index: number | any) => void;
    label: string
};


const InputList = ({onSubmit, elements, onDelete, label}: Props) => {
    const [item, setItem] = useState<any>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItem(e.target.value);
    };

    const handleAddNumber = () => {
        if (item) {
            onSubmit({value: item});
            setItem("");
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} gap={2} sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TextField
                    label={label}
                    variant="outlined"
                    fullWidth
                    value={item}
                    size={"small"}
                    color={"info"}
                    type={"text"}
                    onChange={handleInputChange}
                />
                <Button variant="contained" color={"info"} onClick={handleAddNumber}>
                    <Add />
                </Button>
            </Grid>
            <Grid item xs={12}>
                {elements.map((element: any, index: any) => (
                    <Chip
                        key={index}
                        label={element.value}
                        onDelete={() => onDelete(index)}
                        color="info"
                        size={"small"}
                        sx={{
                            p: "5px",
                            fontSize: '16px',
                            m: 0.5
                        }}
                        variant="outlined"
                    />
                ))}
            </Grid>
        </Grid>
    );
};

export default InputList;
