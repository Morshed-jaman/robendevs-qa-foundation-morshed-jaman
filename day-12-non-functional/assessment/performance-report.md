# Day 12 Assessment — k6 Performance Test Report

## Objective
Measure response time, throughput, and failure rate for a local
sample API using Grafana k6.

## Test Environment
- Application: Local Node.js demo API
- Endpoint: GET http://127.0.0.1:3005/health
- Testing tool: Grafana k6
- Maximum virtual users: 3
- Test duration: Approximately 40 seconds
- Load pattern: Gradual ramp-up and ramp-down

## Actual Results
| Metric | Observed value |
| --- | --- |
| Total HTTP requests | 61 |
| Requests per second | 1.52 |
| Average response time | 1.50 ms |
| Minimum response time | 509.49 microseconds |
| Maximum response time | 16.92 ms |
| 95th-percentile response time | 2.42 ms |
| Request failure rate | 0.00% |
| Successful checks | 122/122 (100%) |
| Interrupted iterations | 0 |

## Threshold Validation
1. p95 response time < 500 ms: PASS (2.42 ms)
2. HTTP request failure rate < 1%: PASS (0.00%)

## Observations
All 61 requests completed without HTTP request failures.
Both assertions passed for every response.
The test met both configured practice thresholds.

## Limitations
This was a small load test against a local, lightweight API.
It does not establish production readiness, maximum capacity,
or performance under real customer workloads.

## Conclusion
The local demo API passed the configured k6 load-test criteria
under the tested workload.

## Evidence
- k6/load-test.js
- k6/demo-api.js
- reports/k6-summary.json
