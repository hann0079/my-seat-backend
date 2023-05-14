// 매일 특정 시간에 WaitingTotal_Hour 테이블, WaitingTotal_Date 테이블 업데이트
cron.schedule('40 16 * * *', () => {
  updateWaitingTotalHour();
  updateWaitingTotalDate();
  console.log('매일 자정마다 작업 실행:', new Date().toString());
});

function updateWaitingTotalHour() {
  const sql = 'SELECT resPhNum, Hour(WaitTime) as WaitTime FROM Waiting';
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      rows.forEach((row) => {
        const resPhNum = row.resPhNum;
        const WaitTime = row.WaitTime;
        if (!resPhNum) { // resPhNum이 null인지 확인
          console.log('resPhNum이 null인 행을 건너뜁니다.');
          return;
        }
        let hour;
        // 분기문을 사용하여 WaitTime에 따라 적절한 칼럼 선택
        if (WaitTime >= 0 && WaitTime < 2) {
          hour = 0;
        } else if (WaitTime >= 2 && WaitTime < 4) {
          hour = 2;
        } else if (WaitTime >= 4 && WaitTime < 6) {
          hour = 4;
        } else if (WaitTime >= 6 && WaitTime < 8) {
          hour = 6;
        } else if (WaitTime >= 8 && WaitTime < 10) {
          hour = 8;
        } else if (WaitTime >= 10 && WaitTime < 12) {
          hour = 10;
        } else if (WaitTime >= 12 && WaitTime < 14) {
          hour = 12;
        } else if (WaitTime >= 14 && WaitTime < 16) {
          hour = 14;
        } else if (WaitTime >= 16 && WaitTime < 18) {
          hour = 16;
        } else if (WaitTime >= 18 && WaitTime < 20) {
          hour = 18;
        } else if (WaitTime >= 20 && WaitTime < 22) {
          hour = 20;
        } else if (WaitTime >= 22 && WaitTime < 24) {
          hour = 22;
        }

        const updateSql = `
          INSERT INTO WaitingTotal_Hour (resPhNum, ${hour}_)
          VALUES (?, 1)
          ON DUPLICATE KEY UPDATE ${hour}_ = COALESCE(${hour}_, 0) + 1;
        `;
        console.log(`Update SQL for resPhNum=${resPhNum}: \n ${updateSql}`); // 출력: update SQL for each row
        const updateParams = [resPhNum];
        connection.query(updateSql, updateParams, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`WaitingTotal_Hour 테이블의 ${resPhNum} 업데이트가 성공했습니다.`);
          }
        });
      });
    }
  });
}

// 매일 특정 시간에 WaitingTotal_Date 업데이트
cron.schedule('45 16 * * *', () => {
  updateWaitingTotalDate();
  console.log('매일 자정마다 작업 실행:', new Date().toString());
});

function updateWaitingTotalDate() {
  const sql = 'SELECT resPhNum, DAYOFWEEK(WaitTime) as DayOfWeek FROM Waiting';
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      rows.forEach((row) => {
        const resPhNum = row.resPhNum;
        const DayOfWeek = row.DayOfWeek;
        if (!resPhNum) { // resPhNum이 null인지 확인
          console.log('resPhNum이 null인 행을 건너뜁니다.');
          return;
        }
        let day;
        switch (DayOfWeek) {
          case 1: day = 'Sun'; break;
          case 2: day = 'Mon'; break;
          case 3: day = 'Tue'; break;
          case 4: day = 'Wed'; break;
          case 5: day = 'Thu'; break;
          case 6: day = 'Fri'; break;
          case 7: day = 'Sat'; break;
        }
        const updateSql = `
          INSERT INTO WaitingTotal_Date (resPhNum, ${day})
          VALUES (?, 1)
          ON DUPLICATE KEY UPDATE ${day} = COALESCE(${day}, 0) + 1;
        `;
        console.log(`Update SQL for resPhNum=${resPhNum}: \n ${updateSql}`); // 출력: update SQL for each row
        const updateParams = [resPhNum];
        connection.query(updateSql, updateParams, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`WaitingTotal_Date 테이블의 ${resPhNum} 업데이트가 성공했습니다.`);
          }
        });
      });
    }
  });
}
