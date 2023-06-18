/* eslint-disable react/no-danger-with-children */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Bar } from 'react-chartjs-2';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Colors,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import Error from 'next/error';
import Spinner from './Spinner';

ChartJS.register(
    CategoryScale,
    Colors,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const CustomersChart = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        getData();
    }, [router.isReady]);

    function getData() {
        // fetch
        fetch('/api/dashboard/customers', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setLoading(false);
                setData(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    // Check if data found
    if (!data) {
        return <Spinner loading={loading} />;
    }

    // Return error if we don't have a product
    if (data && Object.keys(data).length === 0) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    // Format the chart data
    const chartData = [];
    for (const row in data.results) {
        chartData.push({
            x: row,
            y: data.results[row],
        });
    }

    return (
        <Bar
            data={{
                labels: data.labels,
                datasets: [
                    {
                        label: 'New customers',
                        data: chartData,
                        borderWidth: 1,
                        borderColor: '#0d6efd',
                        backgroundColor: '#0d6efd',
                    },
                ],
            }}
            datasetIdKey="id"
            options={{
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            }}
        />
    );
};

export default CustomersChart;
