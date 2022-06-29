import locationKeys from '../../../../components/LocationKeys.data';

export default function handler(req, res) {
    res.status(200).json({
        data: locationKeys
    });
}