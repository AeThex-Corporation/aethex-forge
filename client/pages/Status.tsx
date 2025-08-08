import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Server,
  Database,
  Globe,
  Activity,
  Clock,
  Wifi,
  Shield,
  Zap,
} from "lucide-react";

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  responseTime: number;
  uptime: string;
  lastCheck: string;
  description: string;
}

interface SystemMetric {
  name: string;
  value: string;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  icon: any;
}

export default function Status() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "AeThex Core API",
      status: 'operational',
      responseTime: 145,
      uptime: "99.98%",
      lastCheck: "30 seconds ago",
      description: "Main application API and authentication services"
    },
    {
      name: "Database Services",
      status: 'operational',
      responseTime: 89,
      uptime: "99.99%",
      lastCheck: "1 minute ago",
      description: "Supabase database and storage services"
    },
    {
      name: "CDN & Assets",
      status: 'operational',
      responseTime: 67,
      uptime: "99.95%",
      lastCheck: "45 seconds ago",
      description: "Content delivery network and static assets"
    },
    {
      name: "Authentication",
      status: 'operational',
      responseTime: 123,
      uptime: "99.97%",
      lastCheck: "2 minutes ago",
      description: "OAuth and email authentication systems"
    },
    {
      name: "Project Management",
      status: 'degraded',
      responseTime: 245,
      uptime: "98.84%",
      lastCheck: "3 minutes ago",
      description: "Project creation and management features"
    }
  ]);

  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      name: "Global Uptime",
      value: "99.96",
      unit: "%",
      status: 'good',
      icon: Activity
    },
    {
      name: "Response Time",
      value: "142",
      unit: "ms",
      status: 'good',
      icon: Zap
    },
    {
      name: "Active Users",
      value: "1,247",
      unit: "",
      status: 'good',
      icon: Globe
    },
    {
      name: "Error Rate",
      value: "0.04",
      unit: "%",
      status: 'good',
      icon: Shield
    }
  ]);

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'outage':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getOverallStatus = () => {
    const hasOutage = services.some(s => s.status === 'outage');
    const hasDegraded = services.some(s => s.status === 'degraded');
    
    if (hasOutage) return { status: 'outage', message: 'Service Disruption' };
    if (hasDegraded) return { status: 'degraded', message: 'Partial Outage' };
    return { status: 'operational', message: 'All Systems Operational' };
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const overall = getOverallStatus();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  AeThex System Status
                </h1>
                <p className="text-gray-300">
                  Real-time status and performance monitoring
                </p>
              </div>
              <Button
                onClick={refreshStatus}
                disabled={isRefreshing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {/* Overall Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(overall.status)}
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {overall.message}
                      </h2>
                      <p className="text-gray-400">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={`${getStatusColor(overall.status)} text-white border-0 px-3 py-1`}
                  >
                    {overall.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">{metric.name}</p>
                        <p className={`text-2xl font-bold ${getMetricColor(metric.status)}`}>
                          {metric.value}{metric.unit}
                        </p>
                      </div>
                      <Icon className={`h-8 w-8 ${getMetricColor(metric.status)}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Service Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Service Status
              </CardTitle>
              <CardDescription className="text-gray-300">
                Current operational status of all AeThex services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(service.status)}
                      <div>
                        <h4 className="text-white font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-400">{service.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-gray-400">Response Time</p>
                          <p className="text-white font-medium">{service.responseTime}ms</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Uptime</p>
                          <p className="text-white font-medium">{service.uptime}</p>
                        </div>
                        <Badge 
                          className={`${getStatusColor(service.status)} text-white border-0`}
                        >
                          {service.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Last check: {service.lastCheck}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card className="bg-slate-800/50 border-slate-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">
                      Project Management Performance Restored
                    </p>
                    <p className="text-sm text-gray-400">
                      Response times have returned to normal after brief degradation
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      2 hours ago • Resolved
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">
                      Scheduled Maintenance Completed
                    </p>
                    <p className="text-sm text-gray-400">
                      Database optimization and security updates applied successfully
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      1 day ago • Resolved
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
