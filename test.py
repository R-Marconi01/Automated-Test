import subprocess
import unittest
import logging
import os

# Configure logging
logging.basicConfig(filename='test_execution.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class TestPing(unittest.TestCase):
    def test_ping(self):
        try:
            result = subprocess.run(['ping', '-c', '1', '127.0.0.1'], capture_output=True, text=True, timeout=10)
            self.assertEqual(result.returncode, 0, msg="Ping test failed: " + result.stdout)
            logging.info("Ping test passed.")
        except Exception as e:
            logging.error(f"Error while executing ping test: {str(e)}")
            self.fail("Error while executing ping test: " + str(e))

def run_tests():
    # Discover and run tests
    suite = unittest.TestLoader().loadTestsFromTestCase(TestPing)
    unittest.TextTestRunner(verbosity=2).run(suite)

def generate_report():
    # Generate HTML report
    with open('test_report.html', 'w') as f:
        f.write("<html><head><title>Test Report</title></head><body>")
        f.write("<h1>Test Report</h1>")
        f.write("<table border='1'><tr><th>Test Case</th><th>Result</th></tr>")
        with open('test_execution.log', 'r') as log_file:
            for line in log_file:
                if ' - ERROR - ' in line:
                    test_case = line.split(':')[-1].strip()
                    f.write(f"<tr><td>{test_case}</td><td>Failed</td></tr>")
        f.write("</table></body></html>")

if __name__ == '__main__':
    run_tests()
    generate_report()
