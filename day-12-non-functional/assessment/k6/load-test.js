import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '20s', target: 3 },
    { duration: '10s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500']
  }
};

export default function () {
  const response = http.get('http://127.0.0.1:3005/health');

  check(response, {
    'Status is 200': (r) => r.status === 200,
    'API is healthy': (r) => r.json('status') === 'ok'
  });

  sleep(1);
}