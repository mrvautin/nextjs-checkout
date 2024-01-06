/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Table } from 'react-bootstrap';
import { format } from 'date-fns';
import { currency } from '../lib/helpers';

function lookupValue(object, key) {
    return key.split('.').reduce((o, i) => o[i], object);
}

const DataTable = props => {
    if (props.data.length === 0) {
        return <h3>{props.datamessage || 'No results'}</h3>;
    }

    function printProperty(item, column) {
        const value = lookupValue(item, column.name);
        if (column.format && column.format === 'date') {
            return format(new Date(value), 'dd/MM/yyyy KK:mmaaa');
        }
        if (column.format && column.format === 'amount') {
            return currency(value / 100);
        }
        if (column.format && column.format === 'enabled') {
            if (value === true) {
                return <span className="text-success">Enabled</span>;
            }
            return <span className="text-danger">Disabled</span>;
        }
        if (column.function) {
            return (
                <button
                    className="btn btn-danger"
                    onClick={() => column.function(value)}
                >
                    Delete
                </button>
            );
        }
        if (column.link) {
            return <a href={column.link + value}>{value}</a>;
        }
        return value;
    }

    return (
        <>
            <Table responsive>
                <thead>
                    <tr>
                        {props.columns.map(column => (
                            <th key={column.title}>{column.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map(item => (
                        <tr key={item.id}>
                            {props.columns.map(column => (
                                <td key={column.name}>
                                    {printProperty(item, column)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default DataTable;
