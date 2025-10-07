#!/usr/bin/env node

/**
 * Web Vitals Tracker
 * Real-time monitoring of Core Web Vitals in production
 */

const fs = require("fs");
const path = require("path");

const WEB_VITALS_DIR = path.join(__dirname, "..", ".next", "web-vitals");

class WebVitalsTracker {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      vitals: {
        lcp: [],
        fid: [],
        cls: [],
        fcp: [],
        ttfb: [],
      },
      summary: {},
    };
  }

  /**
   * Track Web Vitals from client-side
   */
  trackWebVitals() {
    const trackingCode = `
// Web Vitals Tracking Script
(function() {
  // Import web-vitals library
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    const vitals = {};
    
    // Track Largest Contentful Paint
    getLCP((metric) => {
      vitals.lcp = {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        timestamp: Date.now()
      };
      sendVitals('lcp', vitals.lcp);
    });
    
    // Track First Input Delay
    getFID((metric) => {
      vitals.fid = {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        timestamp: Date.now()
      };
      sendVitals('fid', vitals.fid);
    });
    
    // Track Cumulative Layout Shift
    getCLS((metric) => {
      vitals.cls = {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        timestamp: Date.now()
      };
      sendVitals('cls', vitals.cls);
    });
    
    // Track First Contentful Paint
    getFCP((metric) => {
      vitals.fcp = {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        timestamp: Date.now()
      };
      sendVitals('fcp', vitals.fcp);
    });
    
    // Track Time to First Byte
    getTTFB((metric) => {
      vitals.ttfb = {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        timestamp: Date.now()
      };
      sendVitals('ttfb', vitals.ttfb);
    });
  });
  
  // Send vitals to server
  function sendVitals(metric, data) {
    if (typeof window !== 'undefined' && window.fetch) {
      fetch('/api/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric,
          data,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      }).catch(console.error);
    }
  }
})();
`;

    return trackingCode;
  }

  /**
   * Create API endpoint for receiving Web Vitals
   */
  createAPIEndpoint() {
    const apiCode = `
// API endpoint for Web Vitals tracking
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { metric, data, url, userAgent, timestamp } = req.body;
    
    // Store the metric data
    const vitalsData = {
      metric,
      data,
      url,
      userAgent,
      timestamp: new Date(timestamp).toISOString()
    };
    
    // In production, you would save this to a database
    // For now, we'll log it
    console.log('Web Vital received:', vitalsData);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing web vital:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
`;

    return apiCode;
  }

  /**
   * Generate Web Vitals dashboard
   */
  generateDashboard() {
    const dashboardCode = `
import React, { useState, useEffect } from 'react';

const WebVitalsDashboard = () => {
  const [vitals, setVitals] = useState({
    lcp: { value: 0, rating: 'unknown' },
    fid: { value: 0, rating: 'unknown' },
    cls: { value: 0, rating: 'unknown' },
    fcp: { value: 0, rating: 'unknown' },
    ttfb: { value: 0, rating: 'unknown' }
  });

  useEffect(() => {
    // In a real implementation, you would fetch from your database
    // For now, we'll use localStorage for demo purposes
    const storedVitals = localStorage.getItem('web-vitals');
    if (storedVitals) {
      setVitals(JSON.parse(storedVitals));
    }
  }, []);

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Web Vitals Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(vitals).map(([metric, data]) => (
          <div key={metric} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{metric.toUpperCase()}</h3>
              <span className="text-2xl">{getRatingIcon(data.rating)}</span>
            </div>
            <div className="text-sm text-gray-600">
              <div>Value: {data.value}ms</div>
              <div className={\`font-medium \${getRatingColor(data.rating)}\`}>
                Rating: {data.rating.replace('-', ' ')}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Performance Guidelines</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>LCP:</strong> Good &lt; 2.5s, Needs Improvement 2.5-4s, Poor &gt; 4s</li>
          <li>• <strong>FID:</strong> Good &lt; 100ms, Needs Improvement 100-300ms, Poor &gt; 300ms</li>
          <li>• <strong>CLS:</strong> Good &lt; 0.1, Needs Improvement 0.1-0.25, Poor &gt; 0.25</li>
          <li>• <strong>FCP:</strong> Good &lt; 1.8s, Needs Improvement 1.8-3s, Poor &gt; 3s</li>
          <li>• <strong>TTFB:</strong> Good &lt; 800ms, Needs Improvement 800-1800ms, Poor &gt; 1800ms</li>
        </ul>
      </div>
    </div>
  );
};

export default WebVitalsDashboard;
`;

    return dashboardCode;
  }

  /**
   * Save Web Vitals data
   */
  saveVitalsData(metric, data) {
    if (!fs.existsSync(WEB_VITALS_DIR)) {
      fs.mkdirSync(WEB_VITALS_DIR, { recursive: true });
    }

    const filePath = path.join(WEB_VITALS_DIR, `${metric}.json`);
    let existingData = [];

    if (fs.existsSync(filePath)) {
      try {
        existingData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (error) {
        console.warn("Could not parse existing vitals data:", error.message);
      }
    }

    existingData.push({
      ...data,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 100 entries
    if (existingData.length > 100) {
      existingData = existingData.slice(-100);
    }

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
  }

  /**
   * Generate Web Vitals report
   */
  generateReport() {
    if (!fs.existsSync(WEB_VITALS_DIR)) {
      console.log("No Web Vitals data found");
      return;
    }

    const files = fs.readdirSync(WEB_VITALS_DIR);
    const report = {
      timestamp: new Date().toISOString(),
      metrics: {},
    };

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const metric = file.replace(".json", "");
        const data = JSON.parse(
          fs.readFileSync(path.join(WEB_VITALS_DIR, file), "utf8")
        );

        if (data.length > 0) {
          const values = data
            .map((d) => d.value)
            .filter((v) => v !== undefined);
          const ratings = data
            .map((d) => d.rating)
            .filter((r) => r !== undefined);

          report.metrics[metric] = {
            count: data.length,
            average:
              values.length > 0
                ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
                : 0,
            min: values.length > 0 ? Math.min(...values) : 0,
            max: values.length > 0 ? Math.max(...values) : 0,
            goodCount: ratings.filter((r) => r === "good").length,
            needsImprovementCount: ratings.filter(
              (r) => r === "needs-improvement"
            ).length,
            poorCount: ratings.filter((r) => r === "poor").length,
          };
        }
      }
    });

    const reportPath = path.join(WEB_VITALS_DIR, "report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("📊 Web Vitals report generated:", reportPath);
    return report;
  }
}

// Run if called directly
if (require.main === module) {
  const tracker = new WebVitalsTracker();
  tracker.generateReport();
}

module.exports = WebVitalsTracker;
