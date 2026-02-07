package com.hotel.aspect;

import java.util.Arrays;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Logging Aspect for automatic method logging across the application.
 * This aspect logs method entries, exits, execution times, and exceptions
 * for controllers, services, repositories, and methods annotated
 * with @Loggable.
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    // Pointcut for all methods in controller package
    @Pointcut("within(com.hotel.controller..*)")
    public void controllerMethods() {
    }

    // Pointcut for all methods in service package
    @Pointcut("within(com.hotel.service..*)")
    public void serviceMethods() {
    }

    // Pointcut for all methods in repository package
    @Pointcut("within(com.hotel.repository..*)")
    public void repositoryMethods() {
    }

    /**
     * Log method entry with class name, method name, and arguments
     */
    @Before("controllerMethods() || serviceMethods()")
    public void logMethodEntry(JoinPoint joinPoint) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        logger.info("➤ Entering: {}.{}() with arguments: {}",
                className, methodName, Arrays.toString(args));
    }

    /**
     * Log method exit with return value
     */
    @AfterReturning(pointcut = "controllerMethods() || serviceMethods()", returning = "result")
    public void logMethodExit(JoinPoint joinPoint, Object result) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        // Don't log the full result object for lists to avoid huge logs
        if (result instanceof java.util.List) {
            logger.info("✓ Exiting: {}.{}() with result: List of {} items",
                    className, methodName, ((java.util.List<?>) result).size());
        } else {
            logger.info("✓ Exiting: {}.{}() with result: {}",
                    className, methodName, result);
        }
    }

    /**
     * Log exceptions with full stack trace
     */
    @AfterThrowing(pointcut = "controllerMethods() || serviceMethods() || repositoryMethods()", throwing = "exception")
    public void logException(JoinPoint joinPoint, Throwable exception) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        logger.error("✗ Exception in {}.{}(): {} - {}",
                className, methodName, exception.getClass().getSimpleName(), exception.getMessage());
        logger.debug("Stack trace:", exception);
    }

    /**
     * Log execution time for all methods in controllers and services
     */
    @Around("controllerMethods() || serviceMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        long startTime = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;

            // Log with different levels based on execution time
            if (executionTime > 1000) {
                logger.warn("⏱ SLOW: {}.{}() executed in {}ms", className, methodName, executionTime);
            } else if (executionTime > 500) {
                logger.info("⏱ {}.{}() executed in {}ms", className, methodName, executionTime);
            } else {
                logger.debug("⏱ {}.{}() executed in {}ms", className, methodName, executionTime);
            }

            return result;
        } catch (Throwable throwable) {
            long executionTime = System.currentTimeMillis() - startTime;
            logger.error("⏱ {}.{}() threw exception after {}ms", className, methodName, executionTime);
            throw throwable;
        }
    }

    /**
     * Log repository operations (database queries)
     */
    @Before("repositoryMethods()")
    public void logRepositoryOperation(JoinPoint joinPoint) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        logger.debug("🔍 Database operation: {}.{}()", className, methodName);
    }
}
