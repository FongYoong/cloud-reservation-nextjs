import { Box } from '@chakra-ui/react';
import { Pie } from 'react-chartjs-2';

export default function PieChart ({ callback, data, ...props }) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <Box {...props} >
            <Pie data={data} options={options} />
        </Box>
)}