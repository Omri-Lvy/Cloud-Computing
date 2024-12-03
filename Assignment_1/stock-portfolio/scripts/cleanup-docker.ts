
import { execSync } from 'child_process';

try {
    execSync('docker stop stock-portfolio-test 2>/dev/null || true');
    execSync('docker rm stock-portfolio-test 2>/dev/null || true');

    execSync('docker rmi stock-portfolio 2>/dev/null || true');
} catch (error) {
    console.log('Cleanup complete (some items might not have existed)');
}