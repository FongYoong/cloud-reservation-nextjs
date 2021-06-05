import { Box, Flex } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';

export default function VerticalBar ({ callback, data, ...props }) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                ticks: {
                    beginAtZero: true,
                    callback: callback,
                },
            },
        },
    };
    return (
        <Box {...props} >
            <Bar data={data} options={options} />
        </Box>
)}