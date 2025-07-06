'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calculator, 
  Download, 
  Save, 
  Play,
  Sun,
  Zap,
  Home,
  Factory,
  Sprout,
  FileText,
  Settings,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function DesignPage() {
  const [systemType, setSystemType] = useState('residential');
  const [roofArea, setRoofArea] = useState([100]);
  const [energyConsumption, setEnergyConsumption] = useState([300]);
  const [tiltAngle, setTiltAngle] = useState([30]);
  const [simulationResults, setSimulationResults] = useState(null);

  const runSimulation = () => {
    // Mock simulation calculation
    const panelWatts = 500;
    const panelArea = 2.5;
    const panelsNeeded = Math.floor(roofArea[0] / panelArea);
    const systemCapacity = (panelsNeeded * panelWatts) / 1000; // kW
    const dailyProduction = systemCapacity * 5.5; // kWh/day (average for Tunisia)
    const monthlyProduction = dailyProduction * 30;
    const annualProduction = dailyProduction * 365;
    const systemCost = systemCapacity * 1500; // TND per kW
    const paybackPeriod = systemCost / (annualProduction * 0.2); // years

    setSimulationResults({
      panelsNeeded,
      systemCapacity,
      dailyProduction,
      monthlyProduction,
      annualProduction,
      systemCost,
      paybackPeriod
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Design & Simulation</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Design
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Parameters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  System Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* System Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">System Type</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant={systemType === 'residential' ? 'default' : 'outline'}
                      onClick={() => setSystemType('residential')}
                      className="justify-start"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Residential
                    </Button>
                    <Button
                      variant={systemType === 'industrial' ? 'default' : 'outline'}
                      onClick={() => setSystemType('industrial')}
                      className="justify-start"
                    >
                      <Factory className="h-4 w-4 mr-2" />
                      Industrial
                    </Button>
                    <Button
                      variant={systemType === 'agricultural' ? 'default' : 'outline'}
                      onClick={() => setSystemType('agricultural')}
                      className="justify-start"
                    >
                      <Sprout className="h-4 w-4 mr-2" />
                      Agricultural
                    </Button>
                  </div>
                </div>

                {/* Roof Area */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Available Roof Area (m²)</Label>
                  <div className="px-3">
                    <Slider
                      value={roofArea}
                      onValueChange={setRoofArea}
                      max={1000}
                      min={20}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {roofArea[0]} m²
                  </div>
                </div>

                {/* Energy Consumption */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Monthly Energy Consumption (kWh)</Label>
                  <div className="px-3">
                    <Slider
                      value={energyConsumption}
                      onValueChange={setEnergyConsumption}
                      max={2000}
                      min={50}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {energyConsumption[0]} kWh/month
                  </div>
                </div>

                {/* Tilt Angle */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Panel Tilt Angle (degrees)</Label>
                  <div className="px-3">
                    <Slider
                      value={tiltAngle}
                      onValueChange={setTiltAngle}
                      max={60}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {tiltAngle[0]}°
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Location</Label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Tunis</option>
                    <option>Sfax</option>
                    <option>Sousse</option>
                    <option>Kairouan</option>
                    <option>Bizerte</option>
                    <option>Gabès</option>
                  </select>
                </div>

                <Button onClick={runSimulation} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="results" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-6">
                {simulationResults ? (
                  <>
                    {/* System Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>System Design Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {simulationResults.panelsNeeded}
                            </div>
                            <div className="text-sm text-gray-600">Solar Panels</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {simulationResults.systemCapacity.toFixed(1)} kW
                            </div>
                            <div className="text-sm text-gray-600">System Capacity</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {simulationResults.dailyProduction.toFixed(1)} kWh
                            </div>
                            <div className="text-sm text-gray-600">Daily Production</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {simulationResults.annualProduction.toFixed(0)} kWh
                            </div>
                            <div className="text-sm text-gray-600">Annual Production</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Sun className="h-5 w-5 mr-2" />
                            Energy Production
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm">Daily Average</span>
                              <span className="font-medium">
                                {simulationResults.dailyProduction.toFixed(1)} kWh
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Monthly Average</span>
                              <span className="font-medium">
                                {simulationResults.monthlyProduction.toFixed(0)} kWh
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Annual Total</span>
                              <span className="font-medium">
                                {simulationResults.annualProduction.toFixed(0)} kWh
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Zap className="h-5 w-5 mr-2" />
                            System Efficiency
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm">Panel Efficiency</span>
                              <span className="font-medium">21.5%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">System Efficiency</span>
                              <span className="font-medium">85%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Performance Ratio</span>
                              <span className="font-medium">0.82</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Environmental Impact */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Environmental Impact</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {(simulationResults.annualProduction * 0.5).toFixed(1)} tons
                            </div>
                            <div className="text-sm text-gray-600">CO₂ Avoided Annually</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {(simulationResults.annualProduction * 0.5 * 25).toFixed(0)} tons
                            </div>
                            <div className="text-sm text-gray-600">CO₂ Avoided (25 years)</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {Math.floor(simulationResults.annualProduction * 0.5 * 25 / 0.5)} trees
                            </div>
                            <div className="text-sm text-gray-600">Equivalent Trees Planted</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Simulation Results
                      </h3>
                      <p className="text-gray-600">
                        Configure your system parameters and run a simulation to see results.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                {simulationResults ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-sm">System Cost</span>
                              <span className="font-medium">
                                {simulationResults.systemCost.toLocaleString()} TND
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Annual Savings</span>
                              <span className="font-medium text-green-600">
                                {(simulationResults.annualProduction * 0.2).toLocaleString()} TND
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Payback Period</span>
                              <span className="font-medium">
                                {simulationResults.paybackPeriod.toFixed(1)} years
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">ROI (25 years)</span>
                              <span className="font-medium text-green-600">
                                {(((simulationResults.annualProduction * 0.2 * 25) / simulationResults.systemCost - 1) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-sm">Monthly Savings</span>
                              <span className="font-medium">
                                {(simulationResults.annualProduction * 0.2 / 12).toFixed(0)} TND
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">25-Year Savings</span>
                              <span className="font-medium text-green-600">
                                {(simulationResults.annualProduction * 0.2 * 25).toLocaleString()} TND
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Net Profit (25 years)</span>
                              <span className="font-medium text-green-600">
                                {((simulationResults.annualProduction * 0.2 * 25) - simulationResults.systemCost).toLocaleString()} TND
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Available Subsidies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <div>
                              <div className="font-medium">PROSOL {systemType.charAt(0).toUpperCase() + systemType.slice(1)}</div>
                              <div className="text-sm text-gray-600">Government subsidy program</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">
                                {systemType === 'residential' ? '3,000' : systemType === 'industrial' ? '25,000' : '15,000'} TND
                              </div>
                              <Badge variant="secondary">Eligible</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Financial Analysis Available
                      </h3>
                      <p className="text-gray-600">
                        Run a simulation to see financial projections and ROI calculations.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex-col">
                        <FileText className="h-6 w-6 mb-2" />
                        Technical Report
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <BarChart3 className="h-6 w-6 mb-2" />
                        Financial Report
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Download className="h-6 w-6 mb-2" />
                        Customer Proposal
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <FileText className="h-6 w-6 mb-2" />
                        Compliance Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}