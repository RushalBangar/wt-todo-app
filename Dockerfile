# ==============================================================================
# Dockerfile for TaskMaster Todo Web App (Tomcat 9 + Java Servlets)
# Packages project as ROOT.war and deploys to Tomcat
# ==============================================================================

FROM tomcat:9.0-jdk11-openjdk-slim

# Step 1: Build the Web Application Archive (ROOT.war)
WORKDIR /build
COPY index.html style.css app.js ./
COPY WEB-INF ./WEB-INF
COPY src ./src

# Compile Java source files into WEB-INF/classes
RUN mkdir -p WEB-INF/classes && \
    javac -cp "/usr/local/tomcat/lib/servlet-api.jar" -d WEB-INF/classes $(find src -name "*.java") && \
    rm -rf src && \
    jar -cvf ROOT.war *

# Step 2: Deploy to Tomcat webapps
RUN rm -rf /usr/local/tomcat/webapps/* && \
    cp /build/ROOT.war /usr/local/tomcat/webapps/ROOT.war && \
    rm -rf /build

# Ensure Tomcat runs from its proper CATALINA_HOME
WORKDIR /usr/local/tomcat

# Expose ports
EXPOSE 8080 10000

# Dynamically adapt Tomcat port to Render's $PORT environment variable and start
CMD ["sh", "-c", "sed -i \"s/port=\\\"8080\\\"/port=\\\"${PORT:-8080}\\\"/g\" /usr/local/tomcat/conf/server.xml && catalina.sh run"]
