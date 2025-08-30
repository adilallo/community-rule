# Performance Monitoring System

## Overview

The Community Rule platform includes a comprehensive performance monitoring system designed to detect performance regressions, maintain performance budgets, and ensure optimal user experience across all components and user interactions.

## Architecture

### Core Components

1. **Performance Monitor Module** (`tests/performance/performance-monitor.js`)
   - Base `PerformanceMonitor` class for metric collection and analysis
   - `WebPerformanceMonitor` for browser-based performance monitoring
   - `PlaywrightPerformanceMonitor` for E2E performance testing

2. **Performance Tests** (`tests/e2e/performance.spec.ts`)
   - Comprehensive E2E performance tests using Playwright
   - Core Web Vitals monitoring
   - Component render performance testing
   - Interaction performance testing

3. **Lighthouse CI Integration** (`lighthouserc.json`)
   - Automated performance audits
   - Performance budget enforcement
   - Core Web Vitals validation

4. **Performance Budgets** (`performance-budgets.json`)
   - Resource size limits
   - Timing budgets
   - Resource count limits

5. **Monitoring Script** (`scripts/performance-monitor.js`)
   - Standalone performance monitoring
   - Regression detection
   - Report generation

## Performance Budgets

### Timing Budgets

| Metric                   | Budget | Baseline | Description               |
| ------------------------ | ------ | -------- | ------------------------- |
| Page Load Time           | 3000ms | 2000ms   | Total page load time      |
| First Contentful Paint   | 2000ms | 1500ms   | First content appears     |
| Largest Contentful Paint | 2500ms | 2000ms   | Largest content element   |
| First Input Delay        | 100ms  | 50ms     | First user interaction    |
| TTFB                     | 600ms  | 400ms    | Time to First Byte        |
| Component Render         | 500ms  | 300ms    | Component rendering time  |
| Interaction Time         | 100ms  | 50ms     | User interaction response |
| Scroll Performance       | 50ms   | 30ms     | Scroll operation time     |

### Resource Budgets

| Resource Type | Size Limit | Count Limit | Description            |
| ------------- | ---------- | ----------- | ---------------------- |
| Scripts       | 300KB      | 10          | JavaScript files       |
| Stylesheets   | 50KB       | 5           | CSS files              |
| Images        | 100KB      | 20          | Image files            |
| Fonts         | 50KB       | 5           | Font files             |
| Total         | 500KB      | 50          | All resources combined |

## Usage

### Running Performance Tests

```bash
# Run all performance tests
npm run e2e:performance

# Run specific performance test
npx playwright test tests/e2e/performance.spec.ts --grep="homepage load performance"

# Run with specific browser
npx playwright test tests/e2e/performance.spec.ts --project=chromium
```

### Running Lighthouse CI

```bash
# Run Lighthouse CI with default settings
npm run lhci

# Run with mobile preset
npm run lhci:mobile

# Run with desktop preset
npm run lhci:desktop

# Run with performance budgets
npm run performance:budget
```

### Running Performance Monitoring

```bash
# Run comprehensive performance monitoring
npm run performance:monitor

# Run monitoring script directly
node scripts/performance-monitor.js
```

## Performance Metrics

### Core Web Vitals

1. **Largest Contentful Paint (LCP)**
   - Measures loading performance
   - Target: < 2.5 seconds
   - Baseline: < 2.0 seconds

2. **First Input Delay (FID)**
   - Measures interactivity
   - Target: < 100ms
   - Baseline: < 50ms

3. **Cumulative Layout Shift (CLS)**
   - Measures visual stability
   - Target: < 0.1
   - Baseline: < 0.05

### Navigation Timing

- **DNS Lookup**: Domain name resolution time
- **TCP Connection**: Connection establishment time
- **TTFB**: Time to First Byte
- **Download**: Resource download time
- **DOM Content Loaded**: DOM parsing completion
- **Load**: Full page load completion

### Component Performance

- **Render Time**: Component rendering duration
- **Interaction Time**: User interaction response time
- **Scroll Performance**: Smooth scrolling performance
- **Memory Usage**: JavaScript heap memory consumption

## Regression Detection

### Automatic Detection

The performance monitoring system automatically detects regressions by:

1. **Comparing against baselines**: Current metrics vs. established baselines
2. **Threshold monitoring**: Real-time threshold violation detection
3. **Trend analysis**: Performance degradation over time
4. **Statistical analysis**: Variance and consistency monitoring

### Regression Thresholds

- **20% degradation**: Triggers regression warning
- **50% degradation**: Triggers regression error
- **Consistent degradation**: Pattern-based regression detection

### Alert System

```javascript
// Example regression detection output
🚨 Performance regression detected: scroll_performance = 111ms (baseline: 30ms)
⚠️  Performance threshold exceeded: interaction_time = 1368ms (threshold: 100ms)
```

## Performance Reports

### Generated Reports

1. **Console Output**: Real-time performance metrics and warnings
2. **JSON Reports**: Structured performance data (`performance-report.json`)
3. **Lighthouse Reports**: Detailed performance audits
4. **Playwright Reports**: E2E test results with performance data

### Report Structure

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "summary": {
    "totalMetrics": 15,
    "regressions": 2,
    "warnings": 3
  },
  "regressions": [
    {
      "metric": "scroll_performance",
      "current": 111,
      "baseline": 30,
      "regression": "270.0%"
    }
  ],
  "warnings": [
    "Performance threshold exceeded: interaction_time = 1368ms (threshold: 100ms)"
  ],
  "metrics": {
    "page_load_time": {
      "latest": 1704,
      "average": 1704,
      "min": 1704,
      "max": 1704,
      "count": 1
    }
  }
}
```

## CI/CD Integration

### GitHub Actions Integration

```yaml
# Example CI workflow
- name: Performance Tests
  run: |
    npm run e2e:performance
    npm run lhci
    npm run performance:budget
```

### Performance Gates

- **Performance Score**: Must be > 90
- **Core Web Vitals**: All metrics within budgets
- **Regression Detection**: No significant regressions
- **Resource Budgets**: All resources within limits

## Best Practices

### Development Workflow

1. **Pre-commit Checks**: Run performance tests before commits
2. **Baseline Updates**: Update baselines after performance improvements
3. **Budget Reviews**: Regular budget review and adjustment
4. **Regression Investigation**: Immediate investigation of detected regressions

### Performance Optimization

1. **Code Splitting**: Implement dynamic imports for better loading
2. **Image Optimization**: Use modern formats and proper sizing
3. **Caching**: Implement effective caching strategies
4. **Bundle Analysis**: Regular bundle size monitoring

### Monitoring Strategy

1. **Continuous Monitoring**: Automated performance testing in CI/CD
2. **Real User Monitoring**: Collect performance data from real users
3. **Alert Thresholds**: Set appropriate alert thresholds
4. **Performance Budgets**: Enforce strict performance budgets

## Troubleshooting

### Common Issues

1. **Test Timeouts**
   - Increase timeout values for slow operations
   - Add proper wait conditions
   - Check for network issues

2. **False Positives**
   - Adjust baseline values
   - Review test environment
   - Check for external dependencies

3. **Performance Fluctuations**
   - Run multiple test iterations
   - Use statistical analysis
   - Consider environmental factors

### Debugging Performance Issues

```bash
# Enable detailed logging
DEBUG=playwright:* npm run e2e:performance

# Run with specific browser and debugging
npx playwright test tests/e2e/performance.spec.ts --project=chromium --debug

# Generate detailed reports
npm run performance:monitor -- --verbose
```

## Future Enhancements

### Planned Features

1. **Real User Monitoring (RUM)**
   - Collect performance data from real users
   - User-centric performance metrics
   - Geographic performance analysis

2. **Advanced Analytics**
   - Machine learning-based regression detection
   - Predictive performance modeling
   - Automated performance optimization suggestions

3. **Performance Dashboard**
   - Web-based performance monitoring dashboard
   - Real-time performance metrics visualization
   - Historical performance trends

4. **Integration with APM Tools**
   - New Relic integration
   - DataDog integration
   - Custom APM tool integration

## Conclusion

The performance monitoring system provides comprehensive coverage of application performance, enabling early detection of regressions and maintaining high performance standards. Regular monitoring and proactive optimization ensure optimal user experience across all platforms and devices.

For questions or issues with the performance monitoring system, please refer to the testing documentation or create an issue in the project repository.
