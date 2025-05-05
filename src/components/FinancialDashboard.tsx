import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Auth } from 'firebase/auth';

interface FinancialDashboardProps {
  auth: Auth;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ auth }) => {
  const [animate, setAnimate] = useState(false);
  const [firstName, setFirstName] = useState('');
  
  useEffect(() => {
    // Start animation after component mounts
    setAnimate(true);
    
    // Get user's first name
    const user = auth.currentUser;
    if (user) {
      // Extract first name from displayName
      if (user.displayName) {
        const nameParts = user.displayName.split(' ');
        setFirstName(nameParts[0]);
      } else if (user.email) {
        // If no display name, use email before @ symbol
        const emailParts = user.email.split('@');
        setFirstName(emailParts[0]);
      }
    }
  }, [auth]);
  
  // Mock data for financial metrics
  const metrics = [
    { 
      id: 1, 
      title: 'Total Assets', 
      value: '$38,245.00', 
      change: '+2.4%', 
      isPositive: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M12 4v16m8-8H4" />
        </svg>
      )
    },
    { 
      id: 2, 
      title: 'Monthly Spending', 
      value: '$2,840.50', 
      change: '-5.1%', 
      isPositive: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      )
    },
    { 
      id: 3, 
      title: 'Investments', 
      value: '$12,590.75', 
      change: '+1.8%', 
      isPositive: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    { 
      id: 4, 
      title: 'Savings Goal', 
      value: '68%', 
      change: '+2.3%', 
      isPositive: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];
  
  // Mock data for recent transactions
  const transactions = [
    { id: 1, name: 'Grocery Store', amount: '$156.32', date: 'Today', category: 'Shopping' },
    { id: 2, name: 'Monthly Rent', amount: '$1,250.00', date: 'Yesterday', category: 'Housing' },
    { id: 3, name: 'Coffee Shop', amount: '$4.75', date: 'Yesterday', category: 'Food' },
    { id: 4, name: 'Gas Station', amount: '$45.80', date: '2 days ago', category: 'Transportation' }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  const chartVariants = {
    hidden: { scaleY: 0 },
    visible: (i: number) => ({
      scaleY: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  // Data for the chart bars
  const chartData = [65, 40, 75, 50, 85, 60, 45];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome, {firstName || 'there'}
        </h2>
        <p className="text-gray-400">Here's an overview of your finances</p>
      </motion.div>
      
      {/* Financial Metrics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate={animate ? "visible" : "hidden"}
      >
        {metrics.map((metric) => (
          <motion.div 
            key={metric.id}
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-green-500 transition-colors duration-300"
            variants={childVariants}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </div>
              <div className="bg-green-900 p-2 rounded-lg text-green-400">
                {metric.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm ${metric.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change}
              </span>
              <span className="text-gray-400 text-sm ml-1">from last month</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Chart and Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 lg:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Spending Overview</h3>
            <select className="bg-gray-700 text-white text-sm rounded-md border-0 p-1.5 focus:ring-2 focus:ring-green-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-4">
            {chartData.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
                  style={{ height: `${value}%` }}
                  custom={index}
                  variants={chartVariants}
                  initial="hidden"
                  animate={animate ? "visible" : "hidden"}
                />
                <span className="text-xs text-gray-400 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Recent Transactions */}
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            <button className="text-green-400 text-sm hover:text-green-300">View All</button>
          </div>
          
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div 
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.1), duration: 0.3 }}
              >
                <div className="flex items-center">
                  <div className="mr-3 bg-green-900 w-10 h-10 rounded-full flex items-center justify-center text-green-400">
                    {transaction.category === 'Shopping' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                      </svg>
                    )}
                    {transaction.category === 'Housing' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    )}
                    {transaction.category === 'Food' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 2a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                      </svg>
                    )}
                    {transaction.category === 'Transportation' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h1.05a2.5 2.5 0 014.9 0H17a1 1 0 001-1v-6a1 1 0 00-.293-.707l-2-2A1 1 0 0015 4H3z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.name}</p>
                    <p className="text-gray-400 text-xs">{transaction.date}</p>
                  </div>
                </div>
                <span className="text-white font-medium">{transaction.amount}</span>
              </motion.div>
            ))}
            
            <motion.button 
              className="w-full mt-4 py-2 bg-transparent border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Transactions
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Insights Section */}
      <motion.div 
        className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">AI Financial Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="bg-green-900 p-2 rounded-full text-green-400 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-medium">Spending Pattern</h4>
            </div>
            <p className="text-gray-300">Your dining expenses increased by 15% this month. Consider setting a budget for eating out.</p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="bg-green-900 p-2 rounded-full text-green-400 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-medium">Saving Opportunity</h4>
            </div>
            <p className="text-gray-300">You could save $128/month by refinancing your current loan at today's rates.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialDashboard;