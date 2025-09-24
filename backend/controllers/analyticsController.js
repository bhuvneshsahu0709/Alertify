const Alert = require('../models/Alert');
const UserAlertState = require('../models/UserAlertState');
const mongoose = require('mongoose');

exports.getDashboardAnalytics = async (req, res) => {
    try {
        const totalAlerts = await Alert.countDocuments({ archived: false });

        const severityCounts = await Alert.aggregate([
            { $match: { archived: false } },
            { $group: { _id: '$severity', count: { $sum: 1 } } }
        ]);

        const totalDelivered = await UserAlertState.countDocuments();
        const totalRead = await UserAlertState.countDocuments({ status: 'Read' });
        
        const now = new Date();
        const totalSnoozed = await UserAlertState.countDocuments({ snoozedUntil: { $gt: now } });

        const alertsWithSnoozeCounts = await Alert.aggregate([
            { $match: { archived: false } },
            {
                $lookup: {
                    from: 'useralertstates',
                    localField: '_id',
                    foreignField: 'alertId',
                    as: 'states'
                }
            },
            {
                $project: {
                    title: 1,
                    snoozeCount: {
                        $size: {
                            $filter: {
                                input: '$states',
                                as: 'state',
                                cond: { $gt: ['$$state.snoozedUntil', now] }
                            }
                        }
                    }
                }
            },
            { $sort: { snoozeCount: -1 } },
            { $limit: 5 }
        ]);

        const analytics = {
            totalAlerts,
            deliveryVsRead: {
                delivered: totalDelivered,
                read: totalRead,
            },
            totalSnoozedNow: totalSnoozed,
            severityBreakdown: severityCounts.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, { Info: 0, Warning: 0, Critical: 0 }),
            topSnoozedAlerts: alertsWithSnoozeCounts,
        };

        res.json(analytics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};