'use strict';

module.exports = {
    countTotal: `
        SELECT
            count( id ) AS count,
            date_format( dt, :displayFormat ) AS dt 
        FROM
            traffic_policing 
        WHERE
            createdAt >= :afterTime 
        GROUP BY
            date_format( createdAt, :dateFormat )
        `,
    countBySatus: `
        SELECT
            count( id ) AS count,
            date_format( dt, :displayFormat ) AS dt 
        FROM
            traffic_policing 
        WHERE
            createdAt >= :afterTime 
            AND status = :status
        GROUP BY
            date_format( createdAt, :dateFormat )
        `,
    avgRes: `
        SELECT
            AVG( costTime ) AS avg 
        FROM
            traffic_policing 
        WHERE
            createdAt >= :afterTime 
            AND status = 2
        `,
    countBySname: `
        SELECT
            count( id ) AS count,
            sname AS serviceName 
        FROM
            traffic_policing 
        WHERE
            createdAt >= :afterTime 
        GROUP BY
            sname
        `
};
