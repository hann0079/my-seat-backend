// 매일 특정 시간에 Waiting 테이블 초기화
cron.schedule('45 16 * * *', () => {
  updateWaiting();
  console.log('매일 자정마다 작업 실행:', new Date().toString());
});

function updateWaiting() {
  const sql = 'delete from Waiting';

    connection.query(sql, params, function (err, result) {
        var resultCode = 404;
        var message = '테이블 초기화 실패';

        if (err) {
            console.log(err);
        } else {
            console.log(`Waiting 테이블 초기화 성공`);
        }
  });
}
