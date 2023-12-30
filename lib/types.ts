export type Session = {
    data: {
        user: {
            id: string;
            created_at: string;
            name: string;
            image: string;
            email: string;
            apiKey: string;
            enabled: boolean;
        };
        expires: string;
    };
};

export type txnPayload = {
    token_scope: string;
    payment_provider_contract: string;
    amount: number;
    merchant_reference: string;
    currency_code: string;
    encrypted_card: string;
    public_key_alias: string;
};

export type notificationPayload = {
    data: {
        event_type: string;
        object_type: string;
        data: string;
    };
};

export type settingsType = {
    id: string;
    running: boolean;
};
