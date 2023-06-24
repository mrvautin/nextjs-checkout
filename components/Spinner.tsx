/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const spinnerStyle = {
    position: 'fixed' as any,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '999',
};

type Props = {
    loading: boolean;
};

const Spinner = (props: Props) => {
    if (props.loading === true) {
        return (
            <div className="container px-4">
                <div className="row">
                    <div
                        className="col-xl-12 p-0 text-center"
                        style={spinnerStyle}
                    >
                        <ClipLoader
                            className="align-middle"
                            color="#0d6efd"
                            loading={true}
                            size={150}
                        />
                    </div>
                </div>
            </div>
        );
    }
    return <></>;
};

export default Spinner;
